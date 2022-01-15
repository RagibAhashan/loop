package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/gob"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"text/template"
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
	"gopkg.in/gomail.v2"

	"github.com/stripe/stripe-go/v72"
	stripesession "github.com/stripe/stripe-go/v72/checkout/session"
	"github.com/stripe/stripe-go/v72/price"
	"github.com/stripe/stripe-go/v72/webhook"
)

// ########### HELPERS ####################
/*
	Expect a stream data and unmarshall it to a golang interface
	Pass reference in target
*/
func jsonDecode(stream io.Reader, target interface{}) error {
	return json.NewDecoder(stream).Decode(target)
}

func jsonUnmarshal(data []byte, target interface{}) error {
	return json.Unmarshal(data, target)
}

func sendLicenseEmail(to string, key string) error {

	from := os.Getenv("DYNASTY_EMAIL")
	password := os.Getenv("DYNASTY_EMAIL_PASSWORD")

	fmt.Println("Sending email to", to)

	gmailClient := gomail.NewDialer("smtp.gmail.com", 587, from, password)

	if os.Getenv("SERVERGO_ENV") == "development" {
		gmailClient.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	}

	// TODO, use hermes package to generate nicer email templates easily
	emailTemplate, _ := template.ParseFiles("./license_email.html")
	var body bytes.Buffer
	emailTemplate.Execute(&body, struct {
		Dashboard string
		Key       string
	}{
		Dashboard: os.Getenv("DASHBOARD_REDIRECT_URI"),
		Key:       key,
	})

	message := gomail.NewMessage()
	message.SetHeader("From", from)
	message.SetHeader("To", to)
	message.SetHeader("Subject", "DynastyAIO License Key")
	message.SetBody("text/html", body.String())

	err := gmailClient.DialAndSend(message)

	return err

}

func getUser(id string, collection *mongo.Collection, user *User) error {
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		fmt.Println("Could not convert user id to ObjectId", err)
		return err
	}

	filter := bson.D{{"_id", objectId}}

	err = collection.FindOne(context.TODO(), filter).Decode(user)

	return err
}

func getLicense(key string, collection *mongo.Collection, license *License) error {
	filter := bson.D{{"key", key}}

	err := collection.FindOne(context.TODO(), filter).Decode(license)

	return err
}

func updateLicense(key string, collection *mongo.Collection, patch bson.D, license *License) error {
	filter := bson.D{{"key", key}}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	err := collection.FindOneAndUpdate(context.TODO(), filter, bson.D{{"$set", patch}}, opts).Decode(license)

	return err
}

func updateLicenseInUser(id string, collection *mongo.Collection, license License, user *User) error {
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		fmt.Println("Could not convert user id to ObjectId", err)
		return err
	}

	filter := bson.M{"_id": objectId}
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
}

func appendLicenseToUser(id string, collection *mongo.Collection, license License, user *User) error {
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		fmt.Println("Could not convert user id to ObjectId", err)
		return err
	}

	filter := bson.M{"_id": objectId}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	patch := bson.D{{"$push", bson.D{{"licenses", license}}}}
	err = collection.FindOneAndUpdate(context.TODO(), filter, patch, opts).Decode(user)

	return err
}

func pullLicenseFromUser(id string, collection *mongo.Collection, license_key string, user *User) error {
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		fmt.Println("Could not convert user id to ObjectId", err)
		return err
	}

	filter := bson.M{"_id": objectId}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	patch := bson.D{{"$pull", bson.D{{"licenses", bson.D{{"key", license_key}}}}}}
	err = collection.FindOneAndUpdate(context.TODO(), filter, patch, opts).Decode(user)

	return err
}

// ########################################

type DiscordOAUTHResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

type DiscordUser struct {
	Id            string `json:"id"`
	Username      string `json:"username"`
	Discriminator string `json:"discriminator"`
	Avatar        string `json:"avatar"`
	Email         string `json:"email"`
}

type User struct {
	Licenses    []License   `bson:"licenses" json:"licenses"`
	Discord     DiscordUser `bson:"discord" json:"discord"`
	AccessToken string      `bson:"accessToken" json:"-"`
}

type DeviceInfo struct {
	Hostname string `bson:"hostname" json:"hostname"`
	Platform string `bson:"platform" json:"platform"`
	Release  string `bson:"release" json:"release"`
}

type Status string

const (
	FREE      Status = "FREE"
	ACTIVATED Status = "ACTIVATED"
)

func (s Status) String() string {
	statuses := [...]string{"FREE", "ACTIVATED"}
	x := string(s)
	for _, v := range statuses {
		if v == x {
			return x
		}
	}
	return ""
}

type License struct {
	Key                string     `bson:"key" json:"key"`
	Status             Status     `bson:"status" json:"status"`
	DeviceFingerprint  string     `bson:"deviceFingerprint" json:"deviceFingerprint"`
	DiscordFingerprint string     `bson:"discordFingerprint" json:"discordFingerprint"`
	DeviceInfo         DeviceInfo `bson:"deviceInfo" json:"deviceInfo"`
	StripeCustomerId   string     `bson:"stripeCustomerId" json:"stripeCustomerId"`
}

var (
	key         = []byte("generate random key and put in an env var")
	store       = sessions.NewCookieStore(key)
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
		Path:   "/",
		MaxAge: 3600 * 24, // 24 hours
	}
}

func init() {
	fmt.Println("Init...")

	initEnvFile()
	initSessionStore()
	connectMongoDB()

	// register user interface so we can store it direcly in session, instead of looking up the db
	// https://stackoverflow.com/questions/44817570/set-array-struct-to-session-in-golang
	gob.Register(&User{})

	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

}

func main() {
	e := echo.New()

	e.Use(session.Middleware(store))

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))

	// CORS - Allow request from localhost
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000", "when_ready_production_put_sitehere"},
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
		AllowCredentials: true,
	}))

	// Login
	e.GET("/oauth/discord/redirect", handleRedirectDiscord)

	// With auth middleware
	e.GET("/user", handleGetUser, checkUserAuth)
	e.GET("/logout", handleLogout, checkUserAuth)
	// Bind to discord
	e.POST("/license/activate", handleActivateLicense, checkUserAuth)
	e.POST("/license/reset", handleResetLicense, checkUserAuth)
	e.POST("/license/unbind-device", handleUnbindDevice, checkUserAuth)

	// stripe
	e.POST("/create-checkout-session", createCheckoutSession)
	e.POST("/create-portal-session", createPortalSession)
	e.POST("/stripe-webhook", handleStripeWebhook) // This route is used to create customer when checkout is completed

	e.Logger.Fatal(e.Start(":4000"))
}

func checkUserAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		currSess, _ := session.Get("session", c)

		if _, ok := currSess.Values["userId"].(string); ok {
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

	user := User{}

	err := getUser(id, userCollection, &user)

	if err != nil {
		fmt.Println("Could not get user")
		return c.NoContent(http.StatusInternalServerError)
	}

	return c.JSON(http.StatusOK, user)
}

func handleLogout(c echo.Context) error {
	currSess, _ := session.Get("session", c)

	// Clear session immediatly
	currSess.Options.MaxAge = -1
	currSess.Save(c.Request(), c.Response())

	return c.NoContent(http.StatusOK)
}

/*
* This will be called by discord oauth api
 */
func handleRedirectDiscord(c echo.Context) error {
	var code = c.QueryParam("code")

	var data = url.Values{
		"client_id":     {os.Getenv("DISCORD_CLIENT_ID")},
		"client_secret": {os.Getenv("DISCORD_CLIENT_SECRET")},
		"grant_type":    {"authorization_code"},
		"code":          {code},
		"redirect_uri":  {os.Getenv("DISCORD_REDIRECT_URI")},
	}

	// Getting Discord token
	resp, err := http.PostForm(os.Getenv("DISCORD_API_ENDPOINT")+"/oauth2/token", data)

	if err != nil {
		fmt.Println("Error occured", err)
		return c.NoContent(http.StatusInternalServerError)
	}

	if resp.StatusCode != http.StatusOK {
		bod, _ := io.ReadAll(resp.Body)
		fmt.Println("Discord API returned error", string(bod), resp.Status)
		return c.NoContent(http.StatusInternalServerError)
	}

	discord_response := DiscordOAUTHResponse{}
	jsonDecode(resp.Body, &discord_response)

	// Getting Discord user info

	var client = &http.Client{Timeout: time.Second * 10}
	req, err := http.NewRequest("GET", "https://discord.com/api/users/@me", nil)

	if err != nil {
		log.Fatal("Error")
	}

	req.Header.Add("authorization", discord_response.TokenType+" "+discord_response.AccessToken)

	resp, err = client.Do(req)

	if err != nil {
		log.Fatal("Error")
	}

	if resp.StatusCode != http.StatusOK {
		bod, _ := io.ReadAll(resp.Body)
		fmt.Println("Discord API returned error", string(bod), resp.Status)
		return c.NoContent(http.StatusInternalServerError)
	}

	discord_user := DiscordUser{}
	jsonDecode(resp.Body, &discord_user)

	// Saving User to database and session

	user := User{
		Licenses:    []License{},
		Discord:     discord_user,
		AccessToken: discord_response.AccessToken,
	}

	// Insert user to mongodb
	fmt.Println("Inserting user to mongodb", os.Getenv("DB_NAME"), os.Getenv("USER_COLLECTION"))

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

		session.Values["userId"] = result.InsertedID.(primitive.ObjectID).Hex()
	} else {
		session.Values["userId"] = userDoc.Lookup("_id").ObjectID().Hex()
	}

	session.Save(c.Request(), c.Response())

	return c.Redirect(http.StatusPermanentRedirect, os.Getenv("DASHBOARD_REDIRECT_URI"))

}

/*
Hash the snowflake ID, it is stated that the id is unique across all discord users
https://discord.com/developers/docs/reference#snowflakes
*/
func computeDiscordFingerprint(discord DiscordUser) string {
	h := sha256.New()
	_, err := h.Write([]byte(discord.Id))

	if err != nil {
		log.Fatal("Hashing failed")
	}

	return hex.EncodeToString(h.Sum(nil))
}

/*
Activate can also be called binding. An activation/binding is for the current logged in discord account
After activating/binding, invite the discord to our group

JSON body {
	key: "XXXXX-XXXX-XXXXX-XXXX"
}

*/
func handleActivateLicense(c echo.Context) error {
	json_map := make(map[string]interface{})

	jsonDecode(c.Request().Body, &json_map)

	sess, _ := session.Get("session", c)
	userCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("USER_COLLECTION"))
	licenseCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("LICENSE_COLLECTION"))
	license_key := json_map["key"].(string)

	// Check if license exists
	license := License{}
	err := getLicense(license_key, licenseCollection, &license)

	if err != nil || license.Status != FREE {
		return c.String(http.StatusBadRequest, "License does not exist or already activated")
	}

	mongoSession, err := mongoClient.StartSession()

	if err != nil {
		fmt.Println("Failed to start session")
		return c.NoContent(http.StatusInternalServerError)
	}

	err = mongoSession.StartTransaction()

	if err != nil {
		fmt.Println("Failed to StartTransaction")
		return c.NoContent(http.StatusInternalServerError)
	}

	// find user in database
	id := sess.Values["userId"].(string)

	user := User{}

	err = getUser(id, userCollection, &user)

	if err != nil {
		fmt.Println("Error Getting User", err)
		return c.NoContent(http.StatusInternalServerError)
	}

	discordFingerprint := computeDiscordFingerprint(user.Discord)

	err = mongo.WithSession(context.TODO(), mongoSession, func(sc mongo.SessionContext) error {
		//update license in database
		patch := bson.D{{"discordFingerprint", discordFingerprint}, {"status", ACTIVATED.String()}}
		err = updateLicense(license_key, licenseCollection, patch, &license)

		if err != nil {
			fmt.Println("Error updating license", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		// add license to user array
		err = appendLicenseToUser(id, userCollection, license, &user)

		if err != nil {
			fmt.Println("Error appending to user")
			return c.NoContent(http.StatusInternalServerError)
		}

		// invite user to discord
		var client = &http.Client{Timeout: time.Second * 10}

		body, err := json.Marshal(map[string]string{"access_token": user.AccessToken})

		if err != nil {
			fmt.Println("Error ", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		req, err := http.NewRequest("PUT", "https://discord.com/api/v8/guilds/"+os.Getenv("DISCORD_GUILD_ID")+"/members/"+user.Discord.Id, bytes.NewBuffer(body))

		if err != nil {
			log.Fatal("Error")
		}

		req.Header.Add("authorization", "Bot "+os.Getenv("DISCORD_BOT_TOKEN"))
		req.Header.Add("Content-Type", "application/json")

		_, err = client.Do(req)

		if err != nil {
			fmt.Println("Could not add member to guild", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		err = mongoSession.CommitTransaction(sc)

		if err != nil {
			fmt.Println("Error commiting transaction", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		return nil
	})

	mongoSession.EndSession(context.TODO())

	return c.JSON(http.StatusOK, user)
}

/*
	Resetting a license will set its state to FREE
	Remove device and discord fingerprint
	Remove license from user licenses array
*/
func handleResetLicense(c echo.Context) error {
	json_map := make(map[string]interface{})

	jsonDecode(c.Request().Body, &json_map)

	mongoSession, err := mongoClient.StartSession()

	if err != nil {
		fmt.Println("Failed to start session")
		return c.NoContent(http.StatusInternalServerError)
	}

	err = mongoSession.StartTransaction()

	if err != nil {
		fmt.Println("Failed to StartTransaction")
		return c.NoContent(http.StatusInternalServerError)
	}

	sess, _ := session.Get("session", c)
	userId := sess.Values["userId"].(string)

	userCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("USER_COLLECTION"))
	licenseCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("LICENSE_COLLECTION"))

	license_key := json_map["key"].(string)
	user := User{}

	err = mongo.WithSession(context.TODO(), mongoSession, func(sc mongo.SessionContext) error {
		// Remove license from array
		err = pullLicenseFromUser(userId, userCollection, license_key, &user)

		if err != nil {
			fmt.Println("Pulling license from user faile", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		// Update license to be free
		patch := bson.D{{"status", FREE}, {"discordFingerprint", ""}, {"deviceFingerprint", ""}}
		license := License{}

		err = updateLicense(license_key, licenseCollection, patch, &license)

		if err != nil {
			fmt.Println("Updating license failed", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		return nil
	})

	mongoSession.EndSession(context.TODO())

	return c.JSON(http.StatusOK, user)
}

/*
Unbind current device if user wants to use the bot in another machine
Check if license is not FREE
Check if license is bound to device <- deviceFingerprint not null <- update license in user array also

*/
func handleUnbindDevice(c echo.Context) error {
	json_map := make(map[string]interface{})

	jsonDecode(c.Request().Body, &json_map)

	sess, _ := session.Get("session", c)
	userId := sess.Values["userId"].(string)

	userCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("USER_COLLECTION"))
	licenseCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("LICENSE_COLLECTION"))

	license_key := json_map["key"].(string)

	license := License{}
	err := getLicense(license_key, licenseCollection, &license)

	if err != nil {
		fmt.Println("Error getting license", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	// Should never be the case
	if license.Status == FREE {
		fmt.Println("Can not unbind a FREE license")
		return c.NoContent(http.StatusInternalServerError)
	}

	// update license
	patch := bson.D{{"deviceFingerprint", ""}}
	err = updateLicense(license_key, licenseCollection, patch, &license)

	if err != nil {
		fmt.Println("Updating license failed", err)
		return c.NoContent(http.StatusInternalServerError)
	}

	// update user license array

	return c.JSON(http.StatusOK, user)

}

func createCheckoutSession(c echo.Context) error {

	lookup_key := c.QueryParams().Get("lookup_key")

	// Find subscription price with lookup_key
	params := &stripe.PriceListParams{
		LookupKeys: stripe.StringSlice([]string{
			lookup_key,
		}),
	}
	i := price.List(params)
	var price *stripe.Price
	for i.Next() {
		p := i.Price()
		price = p
	}

	fmt.Println(price)

	// Create checkout
	checkoutParams := &stripe.CheckoutSessionParams{
		Mode: stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(price.ID),
				Quantity: stripe.Int64(1),
			},
		},
		SuccessURL: stripe.String(os.Getenv("DOMAIN") + "/success?session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:  stripe.String(os.Getenv("DOMAIN")),
	}

	s, err := stripesession.New(checkoutParams)

	if err != nil {
		log.Fatal("session.New:", err)
	}

	fmt.Println(s.ID)
	return c.JSON(http.StatusOK, map[string]string{"id": s.ID})
}

func createPortalSession(c echo.Context) error {

	return c.NoContent(http.StatusOK)
}

func handleStripeWebhook(c echo.Context) error {

	body, err := ioutil.ReadAll(c.Request().Body)
	if err != nil {
		fmt.Println("Failed to read body")
		return c.NoContent(http.StatusInternalServerError)
	}

	// Make sure that the event was indeed made by stripe
	whStripeSecret := os.Getenv("STRIPE_WEBHOOK_SECRET_KEY")
	signatureHeader := c.Request().Header.Get("Stripe-Signature")

	event, err := webhook.ConstructEvent(body, signatureHeader, whStripeSecret)

	if err != nil {
		fmt.Fprintf(os.Stderr, "Webhook signature verification failed. %v\n", err)
		return c.NoContent(http.StatusInternalServerError)
	}

	switch event.Type {
	// if checkout has been completed, create license, send email, and add it to database
	case "checkout.session.completed":
		var checkoutSession stripe.CheckoutSession
		jsonUnmarshal(event.Data.Raw, &checkoutSession)

		fmt.Println("Customer ID", checkoutSession.Customer.ID)
		licenseKey := GenerateKey()
		license := License{
			Key:                licenseKey,
			Status:             "FREE",
			DeviceFingerprint:  "",
			DiscordFingerprint: "",
			DeviceInfo:         DeviceInfo{},
			StripeCustomerId:   checkoutSession.Customer.ID,
		}

		licenseCollection := mongoClient.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("LICENSE_COLLECTION"))

		_, err := licenseCollection.InsertOne(context.TODO(), license)

		if err != nil {
			fmt.Println("Error on mongodb insertion", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		customerEmail := checkoutSession.CustomerDetails.Email

		err = sendLicenseEmail(customerEmail, licenseKey)

		if err != nil {
			fmt.Println("Error sendLicenseEmail", err)
			return c.NoContent(http.StatusInternalServerError)
		}
	}

	return c.NoContent((http.StatusOK))
}
