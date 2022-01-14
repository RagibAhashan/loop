package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func get_json(jsonString io.Reader, target interface{}) error {
    return json.NewDecoder(jsonString).Decode(target)
}

type DiscordOAUTHResponse struct {
	AccessToken string `json:"access_token"`
	TokenType string `json:"token_type"`
	ExpiresIn int `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope string `json:"scope"`
}

type DiscordUser struct {
	Id string `json:"id"`
 	Username string `json:"username"`
	Discriminator string `json:"discriminator"`
	Avatar string `json:"avatar"`
	Email string `json:"email"`
}

type User struct {
	Licenses []string `bson:"licenses" json:"licenses"`
	Discord DiscordUser `bson:"discord" json:"discord"`
}

var (
	key = []byte("generate random key and put in an env var")
	store = sessions.NewCookieStore(key)
	mongoClient *mongo.Client
)

func connectMongoDB() {
	fmt.Println("Connecting to mongodb...")
	
	var err error
	mongoClient, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGODB_URI")))
	
	if err != nil {
		panic(err)
	}

	// Ping the primary
	if err := mongoClient.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected and pinged.")
}

func initEnvFile() {
	env := os.Getenv("SERVERGO_ENV")

	if env == "" {
		env = "development"
	}

	err := godotenv.Load(".env." + env)

	fmt.Println("Loading", env, "env file")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	fmt.Println("Successfully loaded env file.")
}

func initSessionStore() {
	// Session store that will store logged user info
	store.Options = &sessions.Options{
		Path: "/",
		MaxAge: 3600 * 24, // 24 hours
	}
}

func init() {
	fmt.Println("Init...")

	initEnvFile()
	initSessionStore()
	connectMongoDB()
	
}

func main() {
	e := echo.New()

	e.Use(session.Middleware(store))
	
	// CORS - Allow request from localhost
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "when_ready_production_put_sitehere"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
		AllowCredentials: true,

	}))
	
	
	// Login
	e.GET("/oauth/discord", handleLoginDiscord)
	e.GET("/oauth/discord/redirect", handleRedirectDiscord)
	
	// With auth middleware
	e.GET("/user", handleGetUser, checkUserAuth)
	e.GET("/logout", handleLogout, checkUserAuth)


	e.Logger.Fatal(e.Start(":4000"))
}

func checkUserAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		currSess, _ := session.Get("session", c)
		
		if userId, ok := currSess.Values["userId"].(string); ok {
			fmt.Println("User is currently connected with id", userId);
			return next(c)	
		} 		
		
		return c.String(http.StatusUnauthorized, "Unauthorized")
	}
}

/* Get currently connected user

get db id from session and fetch in database

returns User user

*/
func handleGetUser(c echo.Context) error {
	sess, _ := session.Get("session", c)
	userCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("USER_COLLECTION"))

	id := sess.Values["userId"].(string)

	objectId, err := primitive.ObjectIDFromHex(id);
	
	if err != nil {
		fmt.Println("Could not convert user id to ObjectId")
		return c.NoContent(http.StatusInternalServerError)
	}

	filter := bson.M{"_id": objectId}

	user := User{}

	userCollection.FindOne(context.TODO(), filter).Decode(&user)

	return c.JSON(http.StatusOK, user);
}

func handleLogout(c echo.Context) error {
	currSess, _ := session.Get("session", c)
	
	// Clear session immediatly
	currSess.Options.MaxAge = -1
	currSess.Save(c.Request(), c.Response())

	return c.NoContent(http.StatusOK)
}

/*
* This will be called by the client
*/
func handleLoginDiscord(c echo.Context) error {
	return c.Redirect(http.StatusTemporaryRedirect, os.Getenv("DISCORD_OAUTH2_URL"));
}

/*
* This will be called by discord oauth api
*/
func handleRedirectDiscord(c echo.Context) error {
	var code = c.QueryParam("code");

	var data = url.Values{
		"client_id": {os.Getenv("DISCORD_CLIENT_ID")},
		"client_secret": {os.Getenv("DISCORD_CLIENT_SECRET")},
		"grant_type": {"authorization_code"},
		"code" : {code},
		"redirect_uri": {os.Getenv("DISCORD_REDIRECT_URI")},	
	}

	// Getting Discord token
	resp, err := http.PostForm(os.Getenv("DISCORD_API_ENDPOINT") + "/oauth2/token", data)

	if (err != nil) {
		fmt.Println("Error occured", err)
		return c.NoContent(http.StatusInternalServerError)
	}

	
	if (resp.StatusCode != http.StatusOK) {
		bod, _:= io.ReadAll(resp.Body)
		fmt.Println("Discord API returned error", string(bod), resp.Status)
		return c.NoContent(http.StatusInternalServerError)
	}
	
	discord_response := DiscordOAUTHResponse{}
	get_json(resp.Body, &discord_response)
	

	// Getting Discord user info

	var client = &http.Client{Timeout: time.Second * 10}
	req, err := http.NewRequest("GET", "https://discord.com/api/users/@me", nil)
	
	if (err != nil) {
		log.Fatal("Error")
	}
	
	req.Header.Add("authorization", discord_response.TokenType + " " + discord_response.AccessToken)

	resp, err = client.Do(req)

	if (err != nil) {
		log.Fatal("Error")
	}

	if (resp.StatusCode != http.StatusOK) {
		bod, _:= io.ReadAll(resp.Body)
		fmt.Println("Discord API returned error", string(bod), resp.Status)
		return c.NoContent(http.StatusInternalServerError)
	}

	discord_user := DiscordUser{}
	get_json(resp.Body, &discord_user)


	// Saving User to database and session


	user := User {
		Licenses: []string{},
		Discord: discord_user,
	}

	// Insert user to mongodb
	fmt.Println("Inserting user to mongodb", os.Getenv("DB_NAME"),os.Getenv("USER_COLLECTION"))

	userCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("USER_COLLECTION"))
	
	// Check if discord user already exists in database
	var userDoc bson.Raw
	err = userCollection.FindOne(context.TODO(), bson.D{{"discord.id", user.Discord.Id}}).Decode(&userDoc)
	session, _ := session.Get("session", c)
	
	// Did not find user
	if err != nil && err == mongo.ErrNoDocuments {
		result, err := userCollection.InsertOne(context.TODO(), user)

		if err != nil {
			fmt.Println("Error on mongodb insertion", err)
		}

		fmt.Println("Insert used id")
		session.Values["userId"] = result.InsertedID.(primitive.ObjectID).Hex()
	} else {
		fmt.Println("User found just update session", userDoc.Lookup("_id").ObjectID().Hex())
		session.Values["userId"] = userDoc.Lookup("_id").ObjectID().Hex()
	}


	session.Save(c.Request(), c.Response())

	return c.Redirect(http.StatusPermanentRedirect, os.Getenv("DASHBOARD_REDIRECT_URI"))
	
}




