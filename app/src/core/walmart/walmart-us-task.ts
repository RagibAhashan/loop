import { Profile } from '@core/profile';
import { ProfileGroupManager } from '@core/profilegroup-manager';
import { Proxy } from '@core/proxy';
import { ProxySet } from '@core/proxyset';
import { ProxySetManager } from '@core/proxyset-manager';
import { NOTIFY_CAPTCHA_TASK, TASK_STATUS, TASK_SUCCESS } from '../../common/Constants';
import { REGIONS } from '../../common/Regions';
import { WalmartCreditCard } from '../../interfaces/TaskInterfaces';
import { WalmartEncryption } from '../../services/encryption/walmart-encryption';
import UserAgentProvider from '../../services/user-agent-provider';
import { MESSAGES } from '../constants/Constants';
import {
    WALMART_US_ATC_HEADERS,
    WALMART_US_CREATE_CONTRACT_HEADERS,
    WALMART_US_CREATE_CREDIT_CARD_HEADERS,
    WALMART_US_CREATE_DELIVERY_ADDRESS,
    WALMART_US_GET_ITEM_HEADERS,
    WALMART_US_GET_TENDER_PLAN_HEADERS,
    WALMART_US_MERGE_GET_CART_HEADERS,
    WALMART_US_PLACE_ORDER_HEADERS,
    WALMART_US_PRODUCT_PAGE_HEADERS,
    WALMART_US_PURCHASE_CONTRACT_HEADERS,
    WALMART_US_SAVE_TENDER_PC_HEADERS,
    WALMART_US_SET_FULFILLMENT_HEADERS,
    WALMART_US_UPDATE_TENDER_PLAN_HEADERS,
} from '../constants/Walmart';
import { CookieJar } from '../cookie-jar';
import { CaptchaException } from '../exceptions/CaptchaException';
import { debug } from '../log';
import { RequestInstance } from '../request-instance';
import { generatePxCookies } from './scripts/px';
import { WalmartTask } from './walmart-task';
const log = debug.extend('WalmartUSTask');

export class WalmartUSTask extends WalmartTask {
    public offerId: string;
    public productQuantity: number;
    public productSKU: string;

    private static readonly WALMART_SELLER_ID = 'F55CDC31AB754BB68FE0B39041159D63';
    private static readonly WALMART_CATALOG_SELLER_ID = '0';
    private static readonly WALMART_SELLER_DISPLAY_NAME = 'Walmart.com';
    private static readonly IN_STOCK = 'IN_STOCK';

    constructor(
        uuid: string,
        retryDelay: number,
        userProfile: Profile,
        proxySet: ProxySet,
        proxy: Proxy,
        taskGroupName: string,
        requestInstance: RequestInstance,
        profileGroupManager: ProfileGroupManager,
        proxyManager: ProxySetManager,
        offerId: string,
        productQuantity: number,
        productSKU: string,
    ) {
        super(
            uuid,
            retryDelay,
            userProfile,
            proxySet,
            proxy,
            taskGroupName,
            requestInstance,
            profileGroupManager,
            proxyManager,
            offerId,
            productQuantity,
            productSKU,
        );
    }

    private isSoldByWalmartAndInStock(product: any): boolean {
        let catalog = false,
            displayName = false,
            seller = false,
            inStock = false;

        if (typeof product['catalogSellerId'] === 'string') catalog = product['catalogSellerId'] === WalmartUSTask.WALMART_CATALOG_SELLER_ID;

        if (typeof product['catalogSellerId'] === 'number') catalog = product['catalogSellerId'] === +WalmartUSTask.WALMART_CATALOG_SELLER_ID;

        seller = product['sellerId'] === WalmartUSTask.WALMART_SELLER_ID;

        displayName = product['sellerDisplayName'].toLowerCase() === WalmartUSTask.WALMART_SELLER_DISPLAY_NAME.toLowerCase();

        if (product['availabilityStatus'] === WalmartUSTask.IN_STOCK) inStock = true;

        return (catalog || displayName || seller) && inStock;
    }

    async doTask(): Promise<void> {
        try {
            log('Starting task with proxy %O', this.proxy);
            this.cookieJar = new CookieJar(this.requestInstance.baseURL);

            await this.getSession();

            const lineItemId = await this.getLineItemId();

            const cartId = await this.getCartId();

            await this.addToCart(cartId, this.offerId, lineItemId);

            const addressId = await this.createDeliveryAddress();

            await this.setFulFillment(cartId, addressId);

            const contractId = await this.createContract(cartId);

            const tenderPlanId = await this.getTenderPlan(contractId);

            const [creditCardId, encCard] = await this.createCreditCard();

            const newTenderPlanId = await this.updateTenderPlan(contractId, tenderPlanId, creditCardId);

            await this.saveTenderPlanPC(contractId, newTenderPlanId);

            await this.placeOrder(contractId, creditCardId, encCard);

            await this.purchaseContract(contractId);
        } catch (error) {
            log('doTask Error %o', error);
            throw new Error();
        }
    }

    async getSession() {
        let retry = false;
        let headers: any = { ...WALMART_US_PRODUCT_PAGE_HEADERS };

        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.GETTING_PRODUCT_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();
                log('Getting session with cookies %s', cookie);

                if (cookie) {
                    headers = { ...headers, cookie: cookie };
                } else {
                    log('Executing PX script');
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    require('browser-env')({
                        // TODO : discrepancy with this user agent and the one used in the headers
                        userAgent: UserAgentProvider.randomUserAgent(),
                    });

                    const cookies = await generatePxCookies();
                    log('Saving cookies generated by PX script');
                    await this.cookieJar.saveInSessionFromString(cookies);
                }

                // http://walmart.com/ip/pname/pid -> /ip/pname/pid

                const resp = await this.axiosSession.get('TODO', { headers: headers });
                log('Getting session resp %O', resp.status);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }

                log('Cookies %s', this.cookieJar.serializeSession());
            } catch (err) {
                log('Get Session Error');
                this.cancelTask();
                retry = true;
                await this.emitStatusWithDelay(MESSAGES.SESSION_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async getLineItemId(): Promise<string> {
        let retry = false;
        let headers: any = { ...WALMART_US_GET_ITEM_HEADERS, referer: 'htt' };

        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.CHECKING_STOCK_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'query ItemById( $itemId:String! ){ product( itemId:$itemId ){...FullProductFragment}} fragment FullProductFragment on Product{giftingEligibility subscriptionEligible showFulfillmentLink additionalOfferCount shippingRestriction availabilityStatus averageRating brand rhPath partTerminologyId aaiaBrandId manufacturerProductId productTypeId tireSize tireLoadIndex tireSpeedRating viscosity model buyNowEligible showBuyWithWplus preOrder{...PreorderFragment}canonicalUrl catalogSellerId sellerReviewCount sellerAverageRating category{...ProductCategoryFragment}classType classId fulfillmentTitle shortDescription fulfillmentType fulfillmentBadge fulfillmentLabel{wPlusFulfillmentText message shippingText fulfillmentText locationText fulfillmentMethod addressEligibility fulfillmentType postalCode}hasSellerBadge itemType id imageInfo{...ProductImageInfoFragment}location{postalCode stateOrProvinceCode city storeIds}manufacturerName name numberOfReviews orderMinLimit orderLimit offerId priceInfo{priceDisplayCodes{...PriceDisplayCodesFragment} currentPrice{...ProductPriceFragment}wasPrice{...ProductPriceFragment}unitPrice{...ProductPriceFragment}savings{priceString}subscriptionPrice{price priceString intervalFrequency duration percentageRate subscriptionString} priceRange{minPrice maxPrice priceString currencyUnit unitOfMeasure denominations{price priceString selected}}} returnPolicy{returnable freeReturns returnWindow{value unitType}}fsaEligibleInd sellerId sellerName sellerDisplayName secondaryOfferPrice{currentPrice{priceType priceString price}}semStoreData{pickupStoreId deliveryStoreId isSemLocationDifferent}shippingOption{...ShippingOptionFragment}type pickupOption{slaTier accessTypes availabilityStatus storeName storeId}salesUnit usItemId variantCriteria{id categoryTypeAllValues name type variantList{availabilityStatus id images name products swatchImageUrl selected}}variants{...MinimalProductFragment}groupMetaData{groupType groupSubType numberOfComponents groupComponents{quantity offerId componentType productDisplayName}}upc wfsEnabled sellerType ironbankCategory snapEligible promoData{id description terms type templateData{priceString imageUrl}}showAddOnServices addOnServices{serviceType serviceTitle serviceSubTitle groups{groupType groupTitle assetUrl shortDescription services{displayName offerId selectedDisplayName currentPrice{price priceString}}}}productLocation{displayValue}}fragment PriceDisplayCodesFragment on PriceDisplayCodes{clearance eligibleForAssociateDiscount finalCostByWeight hidePriceForSOI priceDisplayCondition pricePerUnitUom reducedPrice rollback strikethrough submapType unitOfMeasure unitPriceDisplayCondition}fragment PreorderFragment on PreOrder{streetDate streetDateDisplayable streetDateType isPreOrder preOrderMessage preOrderStreetDateMessage}fragment ProductCategoryFragment on ProductCategory{categoryPathId path{name url}}fragment ProductImageInfoFragment on ProductImageInfo{allImages{id url zoomable}thumbnailUrl}fragment ShippingOptionFragment on ShippingOption{accessTypes availabilityStatus slaTier deliveryDate maxDeliveryDate shipMethod shipPrice{...ProductPriceFragment}}fragment ProductPriceFragment on ProductPrice{price priceString variantPriceString priceType currencyUnit}fragment MinimalProductFragment on Variant{availabilityStatus imageInfo{...ProductImageInfoFragment}priceInfo{priceDisplayCodes{...PriceDisplayCodesFragment}currentPrice{...ProductPriceFragment}wasPrice{...ProductPriceFragment}unitPrice{...ProductPriceFragment}}productUrl usItemId id:productId fulfillmentBadge}',
                    variables: {
                        itemId: this.productSKU,
                    },
                };

                const resp = await this.axiosSession.post(`/orchestra/home/graphql/ip/${this.productSKU}`, body, { headers: headers });

                const itemDesc = resp.data['data'];

                const product = itemDesc['product'];

                if (!this.isSoldByWalmartAndInStock(product)) {
                    log('This product is not sold by walmart');
                    retry = true;
                    await this.emitStatusWithDelay(MESSAGES.OOS_RETRY_MESSAGE, 'info');
                    continue;
                }

                const lineItemId = product['id'] as string;

                log('Got lineItemId %s', lineItemId);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }
                return lineItemId;
            } catch (err) {
                this.cancelTask();
                retry = true;
                log('Get OfferId Error');
                await this.emitStatusWithDelay(MESSAGES.OOS_RETRY_MESSAGE, 'info');
            }
        } while (retry);
    }

    async getCartId(): Promise<string> {
        let retry = false;
        let headers: any = { ...WALMART_US_MERGE_GET_CART_HEADERS };

        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'mutation MergeAndGetCart( $input:MergeAndGetCartInput! $detailed:Boolean! $includePartialFulfillmentSwitching:Boolean! = false ){mergeAndGetCart(input:$input){id checkoutable customer{id isGuest}addressMode lineItems{id quantity quantityString quantityLabel createdDateTime displayAddOnServices selectedAddOnServices{offerId quantity groupType error{code upstreamErrorCode errorMsg}}isPreOrder @include(if:$detailed) bundleComponents @include(if:$detailed){offerId quantity}selectedVariants @include(if:$detailed){name value}registryId registryInfo{registryId registryType}fulfillmentPreference priceInfo{priceDisplayCodes{showItemPrice priceDisplayCondition finalCostByWeight}itemPrice{...merge_lineItemPriceInfoFragment}wasPrice{...merge_lineItemPriceInfoFragment}unitPrice{...merge_lineItemPriceInfoFragment}linePrice{...merge_lineItemPriceInfoFragment}}product{itemType offerId isAlcohol name @include(if:$detailed) sellerType usItemId addOnServices{serviceType serviceTitle serviceSubTitle groups{groupType groupTitle assetUrl shortDescription services{displayName selectedDisplayName offerId currentPrice{priceString price}serviceMetaData}}}imageInfo @include(if:$detailed){thumbnailUrl}sellerId @include(if:$detailed) sellerName @include(if:$detailed) hasSellerBadge @include(if:$detailed) orderLimit @include(if:$detailed) orderMinLimit @include(if:$detailed) weightUnit @include(if:$detailed) weightIncrement @include(if:$detailed) salesUnit salesUnitType fulfillmentType @include(if:$detailed) fulfillmentSpeed @include(if:$detailed) fulfillmentTitle @include(if:$detailed) classType @include(if:$detailed) rhPath @include(if:$detailed) availabilityStatus @include(if:$detailed) brand @include(if:$detailed) category @include(if:$detailed){categoryPath}departmentName @include(if:$detailed) configuration @include(if:$detailed) snapEligible @include(if:$detailed) preOrder @include(if:$detailed){isPreOrder}}wirelessPlan @include(if:$detailed){planId mobileNumber postPaidPlan{...merge_postpaidPlanDetailsFragment}}fulfillmentSourcingDetails @include(if:$detailed){currentSelection requestedSelection fulfillmentBadge}}fulfillment{intent accessPoint{...merge_accessPointFragment}reservation{...merge_reservationFragment}storeId displayStoreSnackBarMessage homepageBookslotDetails{title subTitle expiryText expiryTime slotExpiryText}deliveryAddress{addressLineOne addressLineTwo city state postalCode firstName lastName id}fulfillmentItemGroups @include(if:$detailed){...on FCGroup{__typename defaultMode collapsedItemIds startDate endDate checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...merge_priceTotalFields}}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram @include(if:$detailed)}partialItemIds @include(if:$includePartialFulfillmentSwitching)}shippingOptions{__typename itemIds availableShippingOptions{__typename id shippingMethod deliveryDate price{__typename displayValue value}label{prefix suffix}isSelected isDefault slaTier}}hasMadeShippingChanges slaGroups{__typename label sellerGroups{__typename id name isProSeller type catalogSellerId shipOptionGroup{__typename deliveryPrice{__typename displayValue value}itemIds shipMethod @include(if:$detailed)}}warningLabel}}...on SCGroup{__typename defaultMode collapsedItemIds checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...merge_priceTotalFields}}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram @include(if:$detailed)}partialItemIds @include(if:$includePartialFulfillmentSwitching)}itemGroups{__typename label itemIds}accessPoint{...merge_accessPointFragment}reservation{...merge_reservationFragment}}...on DigitalDeliveryGroup{__typename defaultMode collapsedItemIds checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...merge_priceTotalFields}}itemGroups{__typename label itemIds}}...on Unscheduled{__typename defaultMode collapsedItemIds checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...merge_priceTotalFields}}itemGroups{__typename label itemIds}accessPoint{...merge_accessPointFragment}reservation{...merge_reservationFragment}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram @include(if:$detailed)}partialItemIds @include(if:$includePartialFulfillmentSwitching)}}...on AutoCareCenter{__typename defaultMode collapsedItemIds startDate endDate accBasketType checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...merge_priceTotalFields}}itemGroups{__typename label itemIds}accessPoint{...merge_accessPointFragment}reservation{...merge_reservationFragment}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram @include(if:$detailed)}partialItemIds @include(if:$includePartialFulfillmentSwitching)}}}suggestedSlotAvailability @include(if:$detailed){isPickupAvailable isDeliveryAvailable nextPickupSlot{startTime endTime slaInMins}nextDeliverySlot{startTime endTime slaInMins}nextUnscheduledPickupSlot{startTime endTime slaInMins}nextSlot{__typename...on RegularSlot{fulfillmentOption fulfillmentType startTime}...on DynamicExpressSlot{fulfillmentOption fulfillmentType startTime slaInMins}...on UnscheduledSlot{fulfillmentOption fulfillmentType startTime unscheduledHoldInDays}...on InHomeSlot{fulfillmentOption fulfillmentType startTime}}}}priceDetails{subTotal{value displayValue label @include(if:$detailed) key @include(if:$detailed) strikeOutDisplayValue @include(if:$detailed) strikeOutValue @include(if:$detailed)}fees @include(if:$detailed){...merge_priceTotalFields}taxTotal @include(if:$detailed){...merge_priceTotalFields}grandTotal @include(if:$detailed){...merge_priceTotalFields}belowMinimumFee @include(if:$detailed){...merge_priceTotalFields}minimumThreshold @include(if:$detailed){value displayValue}ebtSnapMaxEligible @include(if:$detailed){displayValue value}}affirm @include(if:$detailed){isMixedPromotionCart message{description termsUrl imageUrl monthlyPayment termLength isZeroAPR}nonAffirmGroup{...nonAffirmGroupFields}affirmGroups{...on AffirmItemGroup{__typename message{description termsUrl imageUrl monthlyPayment termLength isZeroAPR}flags{type displayLabel}name label itemCount itemIds defaultMode}}}migrationLineItems @include(if:$detailed){quantity quantityLabel quantityString accessibilityQuantityLabel offerId usItemId productName thumbnailUrl addOnService priceInfo{linePrice{value displayValue}}selectedVariants{name value}}checkoutableErrors{code shouldDisableCheckout itemIds}checkoutableWarnings @include(if:$detailed){code itemIds}operationalErrors{offerId itemId requestedQuantity adjustedQuantity code upstreamErrorCode}cartCustomerContext{...cartCustomerContextFragment}}}fragment merge_lineItemPriceInfoFragment on Price{displayValue value}fragment merge_postpaidPlanDetailsFragment on PostPaidPlan{espOrderSummaryId espOrderId espOrderLineId warpOrderId warpSessionId devicePayment{...merge_postpaidPlanPriceFragment}devicePlan{price{...merge_postpaidPlanPriceFragment}frequency duration annualPercentageRate}deviceDataPlan{...merge_deviceDataPlanFragment}}fragment merge_deviceDataPlanFragment on DeviceDataPlan{carrierName planType expiryTime activationFee{...merge_postpaidPlanPriceFragment}planDetails{price{...merge_postpaidPlanPriceFragment}frequency name}agreements{...merge_agreementFragment}}fragment merge_postpaidPlanPriceFragment on PriceDetailRow{key label displayValue value strikeOutDisplayValue strikeOutValue info{title message}}fragment merge_agreementFragment on CarrierAgreement{name type format value docTitle label}fragment merge_priceTotalFields on PriceDetailRow{label displayValue value key strikeOutDisplayValue strikeOutValue}fragment merge_accessPointFragment on AccessPoint{id assortmentStoreId name nodeAccessType fulfillmentType fulfillmentOption displayName timeZone address{addressLineOne addressLineTwo city postalCode state phone}}fragment merge_reservationFragment on Reservation{expiryTime isUnscheduled expired showSlotExpiredError reservedSlot{__typename...on RegularSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata endTime available supportedTimeZone isAlcoholRestricted}...on DynamicExpressSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata available slaInMins maxItemAllowed supportedTimeZone isAlcoholRestricted}...on UnscheduledSlot{price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata unscheduledHoldInDays supportedTimeZone}...on InHomeSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata endTime available supportedTimeZone isAlcoholRestricted}}}fragment nonAffirmGroupFields on NonAffirmGroup{label itemCount itemIds collapsedItemIds}fragment cartCustomerContextFragment on CartCustomerContext{isMembershipOptedIn isEligibleForFreeTrial membershipData{isActiveMember}paymentData{hasCreditCard hasCapOne hasDSCard hasEBT isCapOneLinked showCapOneBanner}}',
                    variables: {
                        input: {
                            cartId: null,
                            strategy: 'MERGE',
                        },
                        detailed: false,
                    },
                };

                const resp = await this.axiosSession.post(`/orchestra/cartxo/graphql`, body, { headers: headers });

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }

                const cartId = resp.data['data']['mergeAndGetCart']['id'];

                log('Get Cart Id resp %O %s', resp.status, cartId);

                return cartId;
            } catch (error) {
                this.cancelTask();
                retry = true;
                // TODO Change this error message
                log('Get Card Id error');
                await this.emitStatusWithDelay('Getting Cart Id Failed', 'error');
            }
        } while (retry);
    }

    async addToCart(cartId: string, offerId: string, lineItemId: string): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_ATC_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.ADD_CART_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'mutation updateItems( $input:UpdateItemsInput! $detailed:Boolean! = false $includePartialFulfillmentSwitching:Boolean! = false ){updateItems(input:$input){id checkoutable customer @include(if:$detailed){id isGuest}addressMode migrationLineItems @include(if:$detailed){quantity quantityLabel quantityString accessibilityQuantityLabel offerId usItemId productName thumbnailUrl addOnService priceInfo{linePrice{value displayValue}}selectedVariants{name value}}lineItems{id quantity quantityString quantityLabel createdDateTime displayAddOnServices selectedAddOnServices{offerId quantity groupType error{code upstreamErrorCode errorMsg}}isPreOrder @include(if:$detailed) bundleComponents{offerId quantity}registryId registryInfo{registryId registryType}fulfillmentPreference selectedVariants @include(if:$detailed){name value}priceInfo{priceDisplayCodes{showItemPrice priceDisplayCondition finalCostByWeight}itemPrice{...merge_lineItemPriceInfoFragment}wasPrice{...merge_lineItemPriceInfoFragment}unitPrice{...merge_lineItemPriceInfoFragment}linePrice{...merge_lineItemPriceInfoFragment}}product{name @include(if:$detailed) usItemId addOnServices{serviceType serviceTitle serviceSubTitle groups{groupType groupTitle assetUrl shortDescription services{displayName selectedDisplayName offerId currentPrice{priceString price}serviceMetaData}}}imageInfo @include(if:$detailed){thumbnailUrl}itemType offerId sellerId @include(if:$detailed) sellerName @include(if:$detailed) hasSellerBadge @include(if:$detailed) orderLimit orderMinLimit weightUnit @include(if:$detailed) weightIncrement @include(if:$detailed) salesUnit salesUnitType sellerType isAlcohol fulfillmentType @include(if:$detailed) fulfillmentSpeed @include(if:$detailed) fulfillmentTitle @include(if:$detailed) classType @include(if:$detailed) rhPath @include(if:$detailed) availabilityStatus @include(if:$detailed) brand @include(if:$detailed) category @include(if:$detailed){categoryPath}departmentName @include(if:$detailed) configuration @include(if:$detailed) snapEligible @include(if:$detailed) preOrder @include(if:$detailed){isPreOrder}}wirelessPlan @include(if:$detailed){planId mobileNumber postPaidPlan{...merge_postpaidPlanDetailsFragment}}fulfillmentSourcingDetails @include(if:$detailed){currentSelection requestedSelection fulfillmentBadge}}fulfillment{intent @include(if:$detailed) accessPoint @include(if:$detailed){...merge_accessPointFragment}reservation @include(if:$detailed){...merge_reservationFragment}storeId @include(if:$detailed) displayStoreSnackBarMessage homepageBookslotDetails @include(if:$detailed){title subTitle expiryText expiryTime slotExpiryText}deliveryAddress @include(if:$detailed){addressLineOne addressLineTwo city state postalCode firstName lastName id}fulfillmentItemGroups @include(if:$detailed){...on FCGroup{__typename defaultMode collapsedItemIds startDate endDate checkoutable priceDetails{subTotal{...merge_priceTotalFields}}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram}partialItemIds @include(if:$includePartialFulfillmentSwitching)}shippingOptions{__typename itemIds availableShippingOptions{__typename id shippingMethod deliveryDate price{__typename displayValue value}label{prefix suffix}isSelected isDefault slaTier}}hasMadeShippingChanges slaGroups{__typename label sellerGroups{__typename id name isProSeller type catalogSellerId shipOptionGroup{__typename deliveryPrice{__typename displayValue value}itemIds shipMethod @include(if:$detailed)}}warningLabel}}...on SCGroup{__typename defaultMode collapsedItemIds checkoutable priceDetails{subTotal{...merge_priceTotalFields}}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram}partialItemIds @include(if:$includePartialFulfillmentSwitching)}itemGroups{__typename label itemIds}accessPoint{...merge_accessPointFragment}reservation{...merge_reservationFragment}}...on DigitalDeliveryGroup{__typename defaultMode collapsedItemIds checkoutable priceDetails{subTotal{...merge_priceTotalFields}}itemGroups{__typename label itemIds}}...on Unscheduled{__typename defaultMode collapsedItemIds checkoutable priceDetails{subTotal{...merge_priceTotalFields}}itemGroups{__typename label itemIds}accessPoint{...merge_accessPointFragment}reservation{...merge_reservationFragment}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram}partialItemIds @include(if:$includePartialFulfillmentSwitching)}}...on AutoCareCenter{__typename defaultMode collapsedItemIds startDate endDate accBasketType checkoutable priceDetails{subTotal{...merge_priceTotalFields}}itemGroups{__typename label itemIds}accessPoint{...merge_accessPointFragment}reservation{...merge_reservationFragment}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram}partialItemIds @include(if:$includePartialFulfillmentSwitching)}}}suggestedSlotAvailability @include(if:$detailed){isPickupAvailable isDeliveryAvailable nextPickupSlot{startTime endTime slaInMins}nextDeliverySlot{startTime endTime slaInMins}nextUnscheduledPickupSlot{startTime endTime slaInMins}nextSlot{__typename...on RegularSlot{fulfillmentOption fulfillmentType startTime}...on DynamicExpressSlot{fulfillmentOption fulfillmentType startTime slaInMins}...on UnscheduledSlot{fulfillmentOption fulfillmentType startTime unscheduledHoldInDays}...on InHomeSlot{fulfillmentOption fulfillmentType startTime}}}}priceDetails{subTotal{value displayValue label @include(if:$detailed) key @include(if:$detailed) strikeOutDisplayValue @include(if:$detailed) strikeOutValue @include(if:$detailed)}fees @include(if:$detailed){...merge_priceTotalFields}taxTotal @include(if:$detailed){...merge_priceTotalFields}grandTotal @include(if:$detailed){...merge_priceTotalFields}belowMinimumFee @include(if:$detailed){...merge_priceTotalFields}minimumThreshold @include(if:$detailed){value displayValue}ebtSnapMaxEligible @include(if:$detailed){displayValue value}balanceToMinimumThreshold @include(if:$detailed){value displayValue}}affirm @include(if:$detailed){isMixedPromotionCart message{description termsUrl imageUrl monthlyPayment termLength isZeroAPR}nonAffirmGroup{...nonAffirmGroupFields}affirmGroups{...on AffirmItemGroup{__typename message{description termsUrl imageUrl monthlyPayment termLength isZeroAPR}flags{type displayLabel}name label itemCount itemIds defaultMode}}}checkoutableErrors{code shouldDisableCheckout itemIds}checkoutableWarnings @include(if:$detailed){code itemIds}operationalErrors{offerId itemId requestedQuantity adjustedQuantity code upstreamErrorCode}cartCustomerContext{...cartCustomerContextFragment}}}fragment merge_postpaidPlanDetailsFragment on PostPaidPlan{espOrderSummaryId espOrderId espOrderLineId warpOrderId warpSessionId devicePayment{...merge_postpaidPlanPriceFragment}devicePlan{price{...merge_postpaidPlanPriceFragment}frequency duration annualPercentageRate}deviceDataPlan{...merge_deviceDataPlanFragment}}fragment merge_deviceDataPlanFragment on DeviceDataPlan{carrierName planType expiryTime activationFee{...merge_postpaidPlanPriceFragment}planDetails{price{...merge_postpaidPlanPriceFragment}frequency name}agreements{...merge_agreementFragment}}fragment merge_postpaidPlanPriceFragment on PriceDetailRow{key label displayValue value strikeOutDisplayValue strikeOutValue info{title message}}fragment merge_agreementFragment on CarrierAgreement{name type format value docTitle label}fragment merge_priceTotalFields on PriceDetailRow{label displayValue value key strikeOutDisplayValue strikeOutValue}fragment merge_lineItemPriceInfoFragment on Price{displayValue value}fragment merge_accessPointFragment on AccessPoint{id assortmentStoreId name nodeAccessType fulfillmentType fulfillmentOption displayName timeZone address{addressLineOne addressLineTwo city postalCode state phone}}fragment merge_reservationFragment on Reservation{expiryTime isUnscheduled expired showSlotExpiredError reservedSlot{__typename...on RegularSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata endTime available supportedTimeZone isAlcoholRestricted}...on DynamicExpressSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata available slaInMins maxItemAllowed supportedTimeZone isAlcoholRestricted}...on UnscheduledSlot{price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata unscheduledHoldInDays supportedTimeZone}...on InHomeSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata endTime available supportedTimeZone isAlcoholRestricted}}}fragment nonAffirmGroupFields on NonAffirmGroup{label itemCount itemIds collapsedItemIds}fragment cartCustomerContextFragment on CartCustomerContext{isMembershipOptedIn isEligibleForFreeTrial membershipData{isActiveMember}paymentData{hasCreditCard hasCapOne hasDSCard hasEBT isCapOneLinked showCapOneBanner}}',
                    variables: {
                        input: {
                            cartId: cartId,
                            items: [
                                {
                                    offerId: offerId,
                                    quantity: this.productQuantity,
                                    lineItemId: lineItemId,
                                },
                            ],
                            semStoreId: '',
                            semPostalCode: '',
                            isGiftOrder: null,
                        },
                        detailed: false,
                        includePartialFulfillmentSwitching: true,
                    },
                };

                const resp = await this.axiosSession.post('/orchestra/home/graphql', body, { headers: headers });

                log('Add to Cart response %O', resp.status);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }
            } catch (error) {
                this.cancelTask();
                retry = true;
                log('Add To Cart Error');
                await this.emitStatusWithDelay(MESSAGES.ADD_CART_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async createDeliveryAddress(): Promise<string> {
        let retry = false;
        let headers: any = { ...WALMART_US_CREATE_DELIVERY_ADDRESS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.BILLING_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'mutation CreateDeliveryAddress($input:AccountAddressesInput!){createAccountAddress(input:$input){...DeliveryAddressMutationResponse}}fragment DeliveryAddressMutationResponse on MutateAccountAddressResponse{...AddressMutationResponse newAddress{id accessPoint{...AccessPoint}...BaseAddressResponse}}fragment AccessPoint on AccessPointRovr{id assortmentStoreId fulfillmentType accountFulfillmentOption accountAccessType}fragment AddressMutationResponse on MutateAccountAddressResponse{errors{code}enteredAddress{...BasicAddress}suggestedAddresses{...BasicAddress sealedAddress}newAddress{id...BaseAddressResponse}allowAvsOverride}fragment BasicAddress on AccountAddressBase{addressLineOne addressLineTwo city state postalCode}fragment BaseAddressResponse on AccountAddress{...BasicAddress firstName lastName phone isDefault deliveryInstructions serviceStatus capabilities allowEditOrRemove}',
                    variables: {
                        input: {
                            address: {
                                addressLineOne: this.userProfile.shipping.address,
                                addressLineTwo: '',
                                city: this.userProfile.shipping.town,
                                postalCode: this.userProfile.shipping.postalCode,
                                state: REGIONS[this.userProfile.shipping.country][this.userProfile.shipping.region].isocodeShort,
                                addressType: null,
                                businessName: null,
                                isApoFpo: null,
                                isLoadingDockAvailable: null,
                                isPoBox: null,
                                sealedAddress: null,
                            },
                            firstName: this.userProfile.shipping.firstName,
                            lastName: this.userProfile.shipping.lastName,
                            deliveryInstructions: null,
                            displayLabel: null,
                            isDefault: false,
                            phone: this.userProfile.shipping.phone,
                            overrideAvs: false,
                        },
                    },
                };

                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                const addressId = resp.data['data']['createAccountAddress']['newAddress']['id'];

                log('Create delivery address response %s', addressId);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }

                return addressId;
            } catch (error) {
                this.cancelTask();
                retry = true;
                log('Create delivery address Error');
                await this.emitStatusWithDelay(MESSAGES.ADDRESS_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async setFulFillment(cartId: string, addressId: string): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_SET_FULFILLMENT_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };
                const body = {
                    query: 'mutation setFulfillment( $input:SetFulfillmentInput! $includePartialFulfillmentSwitching:Boolean! = false ){setFulfillment(input:$input){...CartFragment}}fragment CartFragment on Cart{id checkoutable customer{id isGuest}cartGiftingDetails{isGiftOrder hasGiftEligibleItem isAddOnServiceAdjustmentNeeded isWalmartProtectionPlanPresent isAppleCarePresent}addressMode migrationLineItems{quantity quantityLabel quantityString accessibilityQuantityLabel offerId usItemId productName thumbnailUrl addOnService priceInfo{linePrice{value displayValue}}selectedVariants{name value}}lineItems{id quantity quantityString quantityLabel isPreOrder isGiftEligible displayAddOnServices createdDateTime selectedAddOnServices{offerId quantity groupType isGiftEligible error{code upstreamErrorCode errorMsg}}bundleComponents{offerId quantity}registryId fulfillmentPreference selectedVariants{name value}priceInfo{priceDisplayCodes{showItemPrice priceDisplayCondition finalCostByWeight}itemPrice{...lineItemPriceInfoFragment}wasPrice{...lineItemPriceInfoFragment}unitPrice{...lineItemPriceInfoFragment}linePrice{...lineItemPriceInfoFragment}}product{name usItemId imageInfo{thumbnailUrl}addOnServices{serviceType serviceTitle serviceSubTitle groups{groupType groupTitle assetUrl shortDescription services{displayName selectedDisplayName offerId currentPrice{priceString price}serviceMetaData}}}itemType offerId sellerId sellerName hasSellerBadge orderLimit orderMinLimit weightUnit weightIncrement salesUnit salesUnitType sellerType isAlcohol fulfillmentType fulfillmentSpeed fulfillmentTitle classType rhPath availabilityStatus brand category{categoryPath}departmentName configuration snapEligible preOrder{isPreOrder}}registryInfo{registryId registryType}wirelessPlan{planId mobileNumber postPaidPlan{...postpaidPlanDetailsFragment}}fulfillmentSourcingDetails{currentSelection requestedSelection fulfillmentBadge}availableQty}fulfillment{intent accessPoint{...accessPointFragment}reservation{...reservationFragment}storeId displayStoreSnackBarMessage homepageBookslotDetails{title subTitle expiryText expiryTime slotExpiryText}deliveryAddress{addressLineOne addressLineTwo city state postalCode firstName lastName id}fulfillmentItemGroups{...on FCGroup{__typename defaultMode collapsedItemIds startDate endDate checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...priceTotalFields}}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram}partialItemIds @include(if:$includePartialFulfillmentSwitching)}shippingOptions{__typename itemIds availableShippingOptions{__typename id shippingMethod deliveryDate price{__typename displayValue value}label{prefix suffix}isSelected isDefault slaTier}}hasMadeShippingChanges slaGroups{__typename label deliveryDate sellerGroups{__typename id name isProSeller type catalogSellerId shipOptionGroup{__typename deliveryPrice{__typename displayValue value}itemIds shipMethod}}warningLabel}}...on SCGroup{__typename defaultMode collapsedItemIds checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...priceTotalFields}}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram}partialItemIds @include(if:$includePartialFulfillmentSwitching)}itemGroups{__typename label itemIds}accessPoint{...accessPointFragment}reservation{...reservationFragment}}...on DigitalDeliveryGroup{__typename defaultMode collapsedItemIds checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...priceTotalFields}}itemGroups{__typename label itemIds}}...on Unscheduled{__typename defaultMode collapsedItemIds checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...priceTotalFields}}itemGroups{__typename label itemIds}accessPoint{...accessPointFragment}reservation{...reservationFragment}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram}partialItemIds @include(if:$includePartialFulfillmentSwitching)}}...on AutoCareCenter{__typename defaultMode collapsedItemIds startDate endDate accBasketType checkoutable checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}priceDetails{subTotal{...priceTotalFields}}itemGroups{__typename label itemIds}accessPoint{...accessPointFragment}reservation{...reservationFragment}fulfillmentSwitchInfo{fulfillmentType benefit{type price itemCount date isWalmartPlusProgram}partialItemIds @include(if:$includePartialFulfillmentSwitching)}}}suggestedSlotAvailability{isPickupAvailable isDeliveryAvailable nextPickupSlot{startTime endTime slaInMins}nextDeliverySlot{startTime endTime slaInMins}nextUnscheduledPickupSlot{startTime endTime slaInMins}nextSlot{__typename...on RegularSlot{fulfillmentOption fulfillmentType startTime}...on DynamicExpressSlot{fulfillmentOption fulfillmentType startTime slaInMins}...on UnscheduledSlot{fulfillmentOption fulfillmentType startTime unscheduledHoldInDays}...on InHomeSlot{fulfillmentOption fulfillmentType startTime}}}}priceDetails{subTotal{...priceTotalFields}fees{...priceTotalFields}taxTotal{...priceTotalFields}grandTotal{...priceTotalFields}belowMinimumFee{...priceTotalFields}minimumThreshold{value displayValue}ebtSnapMaxEligible{displayValue value}balanceToMinimumThreshold{value displayValue}}affirm{isMixedPromotionCart message{description termsUrl imageUrl monthlyPayment termLength isZeroAPR}nonAffirmGroup{...nonAffirmGroupFields}affirmGroups{...on AffirmItemGroup{__typename message{description termsUrl imageUrl monthlyPayment termLength isZeroAPR}flags{type displayLabel}name label itemCount itemIds defaultMode}}}checkoutableErrors{code shouldDisableCheckout itemIds upstreamErrors{offerId upstreamErrorCode}}checkoutableWarnings{code itemIds}operationalErrors{offerId itemId requestedQuantity adjustedQuantity code upstreamErrorCode}cartCustomerContext{...cartCustomerContextFragment}}fragment postpaidPlanDetailsFragment on PostPaidPlan{espOrderSummaryId espOrderId espOrderLineId warpOrderId warpSessionId devicePayment{...postpaidPlanPriceFragment}devicePlan{price{...postpaidPlanPriceFragment}frequency duration annualPercentageRate}deviceDataPlan{...deviceDataPlanFragment}}fragment deviceDataPlanFragment on DeviceDataPlan{carrierName planType expiryTime activationFee{...postpaidPlanPriceFragment}planDetails{price{...postpaidPlanPriceFragment}frequency name}agreements{...agreementFragment}}fragment postpaidPlanPriceFragment on PriceDetailRow{key label displayValue value strikeOutDisplayValue strikeOutValue info{title message}}fragment agreementFragment on CarrierAgreement{name type format value docTitle label}fragment priceTotalFields on PriceDetailRow{label displayValue value key strikeOutDisplayValue strikeOutValue}fragment lineItemPriceInfoFragment on Price{displayValue value}fragment accessPointFragment on AccessPoint{id assortmentStoreId name nodeAccessType fulfillmentType fulfillmentOption displayName timeZone address{addressLineOne addressLineTwo city postalCode state phone}}fragment reservationFragment on Reservation{expiryTime isUnscheduled expired showSlotExpiredError reservedSlot{__typename...on RegularSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}nodeAccessType accessPointId fulfillmentOption startTime fulfillmentType slotMetadata endTime available supportedTimeZone isAlcoholRestricted}...on DynamicExpressSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata available slaInMins maxItemAllowed supportedTimeZone isAlcoholRestricted}...on UnscheduledSlot{price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata unscheduledHoldInDays supportedTimeZone}...on InHomeSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata endTime available supportedTimeZone isAlcoholRestricted}}}fragment nonAffirmGroupFields on NonAffirmGroup{label itemCount itemIds collapsedItemIds}fragment cartCustomerContextFragment on CartCustomerContext{isMembershipOptedIn isEligibleForFreeTrial membershipData{isActiveMember}paymentData{hasCreditCard hasCapOne hasDSCard hasEBT isCapOneLinked showCapOneBanner}}',
                    variables: {
                        input: {
                            addressId: addressId,
                            cartId: cartId,
                            registry: null,
                            fulfillmentOption: 'SHIPPING', // TODO check if this field is always constant or else get it from CreateDeliveryAddress
                            postalCode: null,
                            storeId: null,
                            isGiftAddress: null,
                        },
                        includePartialFulfillmentSwitching: true,
                    },
                };

                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                log('Set Fulfillment response %O', resp.status);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }
            } catch (error) {
                this.cancelTask();
                retry = true;

                log('Set Fulfillment Error');
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async createContract(cartId: string): Promise<string> {
        let retry = false;
        let headers: any = { ...WALMART_US_CREATE_CONTRACT_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'mutation CreateContract( $createContractInput:CreatePurchaseContractInput! $promosEnable:Boolean! $wplusEnabled:Boolean! ){createPurchaseContract(input:$createContractInput){...ContractFragment}}fragment ContractFragment on PurchaseContract{id associateDiscountStatus addressMode tenderPlanId papEbtAllowed allowedPaymentGroupTypes cartCustomerContext @include(if:$wplusEnabled){isMembershipOptedIn isEligibleForFreeTrial paymentData{hasCreditCard}}checkoutError{code errorData{__typename...on OutOfStock{offerId}__typename...on UnavailableOffer{offerId}__typename...on ItemExpired{offerId}__typename...on ItemQuantityAdjusted{offerId requestedQuantity adjustedQuantity}}operationalErrorCode message}checkoutableWarnings{code itemIds}allocationStatus payments{id paymentType cardType lastFour isDefault cvvRequired preferenceId paymentPreferenceId paymentHandle expiryMonth expiryYear firstName lastName email amountPaid cardImage cardImageAlt isLinkedCard capOneReward{credentialId redemptionUrl redemptionRate redemptionMethod rewardPointsBalance rewardPointsSelected rewardAmountSelected}remainingBalance{displayValue value}}order{id status orderVersion mobileNumber}terms{alcoholAccepted bagFeeAccepted smsOptInAccepted marketingEmailPrefOptIn}donationDetails{charityEIN charityName amount{displayValue value}acceptDonation}lineItems{...LineItemFields}tippingDetails{suggestedAmounts{value displayValue}maxAmount{value displayValue}selectedTippingAmount{value displayValue}}customer{id firstName lastName isGuest email phone}fulfillment{deliveryDetails{deliveryInstructions deliveryOption}pickupChoices{isSelected fulfillmentType accessType accessMode accessPointId}deliveryAddress{...AddressFields}alternatePickupPerson{...PickupPersonFields}primaryPickupPerson{...PickupPersonFields}fulfillmentItemGroups{...FulfillmentItemGroupsFields}accessPoint{...AccessPointFields}reservation{...ReservationFields}}priceDetails{subTotal{...PriceDetailRowFields}totalItemQuantity fees{...PriceDetailRowFields}taxTotal{...PriceDetailRowFields}grandTotal{...PriceDetailRowFields}belowMinimumFee{...PriceDetailRowFields}authorizationAmount{...PriceDetailRowFields}weightDebitTotal{...PriceDetailRowFields}discounts{...PriceDetailRowFields}otcDeliveryBenefit{...PriceDetailRowFields}ebtSnapMaxEligible{...PriceDetailRowFields}ebtCashMaxEligible{...PriceDetailRowFields}hasAmountUnallocated affirm{__typename message{...AffirmMessageFields}}}checkoutGiftingDetails{isCheckoutGiftingOptin isWalmartProtectionPlanPresent isAppleCarePresent isRestrictedPaymentPresent giftMessageDetails{giftingMessage recipientEmail recipientName senderName}}promotions @include(if:$promosEnable){displayValue promoId terms}showPromotions @include(if:$promosEnable) errors{code message lineItems{...LineItemFields}}}fragment LineItemFields on LineItem{id quantity quantityString quantityLabel accessibilityQuantityLabel isPreOrder fulfillmentSourcingDetails{currentSelection requestedSelection}packageQuantity priceInfo{priceDisplayCodes{showItemPrice priceDisplayCondition finalCostByWeight}itemPrice{displayValue value}linePrice{displayValue value}preDiscountedLinePrice{displayValue value}wasPrice{displayValue value}unitPrice{displayValue value}}isSubstitutionSelected isGiftEligible selectedVariants{name value}product{id name usItemId itemType imageInfo{thumbnailUrl}offerId orderLimit orderMinLimit weightIncrement weightUnit averageWeight salesUnitType availabilityStatus isSubstitutionEligible isAlcohol configuration hasSellerBadge sellerId sellerName sellerType preOrder{...preOrderFragment}addOnServices{serviceType groups{groupType services{selectedDisplayName offerId currentPrice{priceString}}}}}discounts{key label displayValue @include(if:$promosEnable) displayLabel @include(if:$promosEnable)}wirelessPlan{planId mobileNumber __typename postPaidPlan{...postpaidPlanDetailsFragment}}selectedAddOnServices{offerId quantity groupType}registryInfo{registryId registryType}}fragment postpaidPlanDetailsFragment on PostPaidPlan{__typename espOrderSummaryId espOrderId espOrderLineId warpOrderId warpSessionId devicePayment{...postpaidPlanPriceFragment}devicePlan{__typename price{...postpaidPlanPriceFragment}frequency duration annualPercentageRate}deviceDataPlan{...deviceDataPlanFragment}}fragment deviceDataPlanFragment on DeviceDataPlan{__typename carrierName planType expiryTime activationFee{...postpaidPlanPriceFragment}planDetails{__typename price{...postpaidPlanPriceFragment}frequency name}agreements{...agreementFragment}}fragment postpaidPlanPriceFragment on PriceDetailRow{__typename key label displayValue value strikeOutDisplayValue strikeOutValue info{__typename title message}}fragment agreementFragment on CarrierAgreement{__typename name type format value docTitle label}fragment preOrderFragment on PreOrder{streetDate streetDateDisplayable streetDateType isPreOrder preOrderMessage preOrderStreetDateMessage}fragment AddressFields on Address{id addressLineOne addressLineTwo city state postalCode firstName lastName phone}fragment PickupPersonFields on PickupPerson{id firstName lastName email}fragment PriceDetailRowFields on PriceDetailRow{__typename key label displayValue value strikeOutValue strikeOutDisplayValue info{__typename title message}}fragment AccessPointFields on AccessPoint{id name assortmentStoreId displayName timeZone address{id addressLineOne addressLineTwo city state postalCode firstName lastName phone}isTest allowBagFee bagFeeValue isExpressEligible fulfillmentOption instructions nodeAccessType}fragment ReservationFields on Reservation{id expiryTime isUnscheduled expired showSlotExpiredError reservedSlot{__typename...on RegularSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata slotExpiryTime endTime available supportedTimeZone}...on DynamicExpressSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime endTime fulfillmentType slotMetadata slotExpiryTime available slaInMins maxItemAllowed supportedTimeZone}...on UnscheduledSlot{price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata unscheduledHoldInDays supportedTimeZone}...on InHomeSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata slotExpiryTime endTime available supportedTimeZone}}}fragment AffirmMessageFields on AffirmMessage{__typename description termsUrl imageUrl monthlyPayment termLength isZeroAPR}fragment FulfillmentItemGroupsFields on FulfillmentItemGroup{...on SCGroup{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on DigitalDeliveryGroup{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}}...on Unscheduled{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on FCGroup{__typename defaultMode collapsedItemIds startDate endDate isUnscheduledDeliveryEligible shippingOptions{__typename itemIds availableShippingOptions{__typename id shippingMethod deliveryDate price{__typename displayValue value}label{prefix suffix}isSelected isDefault}}hasMadeShippingChanges slaGroups{__typename label deliveryDate warningLabel sellerGroups{__typename id name isProSeller type shipOptionGroup{__typename deliveryPrice{__typename displayValue value}itemIds shipMethod}}}}...on AutoCareCenter{__typename defaultMode startDate endDate accBasketType collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}}',
                    variables: {
                        createContractInput: {
                            cartId: cartId,
                        },
                        promosEnable: true,
                        wplusEnabled: true,
                    },
                };

                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                const contractId = resp.data['data']['createPurchaseContract']['id'];

                log('Create Contract response %O', resp.status);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }

                return contractId;
            } catch (error) {
                console.log('Create contract Error');
                this.cancelTask();
                retry = true;
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async getTenderPlan(contractId: string): Promise<string> {
        let retry = false;
        let headers: any = { ...WALMART_US_GET_TENDER_PLAN_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'query getTenderPlan($tenderPlanInput:TenderPlanInput!){tenderPlan(input:$tenderPlanInput){__typename tenderPlan{...TenderPlanFields}errors{...ErrorFields}}}fragment TenderPlanFields on TenderPlan{__typename id contractId grandTotal{...PriceDetailRowFields}authorizationAmount{...PriceDetailRowFields}allocationStatus paymentGroups{...PaymentGroupFields}otcDeliveryBenefit{...PriceDetailRowFields}otherAllowedPayments{type status}addPaymentType hasAmountUnallocated weightDebitTotal{...PriceDetailRowFields}}fragment PriceDetailRowFields on PriceDetailRow{__typename key label displayValue value info{__typename title message}}fragment PaymentGroupFields on TenderPlanPaymentGroup{__typename type subTotal{__typename key label displayValue value info{__typename title message}}selectedCount allocations{...CreditCardAllocationFragment...GiftCardAllocationFragment...EbtCardAllocationFragment...DsCardAllocationFragment...PayPalAllocationFragment...AffirmAllocationFragment}coversOrderTotal statusMessage}fragment CreditCardAllocationFragment on CreditCardAllocation{__typename card{...CreditCardFragment}canEditOrDelete canDeselect isEligible isSelected allocationAmount{__typename displayValue value}capOneReward{...CapOneFields}statusMessage{__typename messageStatus messageType}paymentType}fragment CapOneFields on CapOneReward{credentialId redemptionRate redemptionUrl redemptionMethod rewardPointsBalance rewardPointsSelected rewardAmountSelected}fragment CreditCardFragment on CreditCard{__typename id isDefault cardAccountLinked needVerifyCVV cardType expiryMonth expiryYear isExpired firstName lastName lastFour isEditable phone}fragment GiftCardAllocationFragment on GiftCardAllocation{__typename card{...GiftCardFields}canEditOrDelete canDeselect isEligible isSelected allocationAmount{__typename displayValue value}statusMessage{__typename messageStatus messageType}paymentType remainingBalance{__typename displayValue value}}fragment GiftCardFields on GiftCard{__typename id balance{cardBalance}lastFour displayLabel}fragment EbtCardAllocationFragment on EbtCardAllocation{__typename card{__typename id lastFour firstName lastName}canEditOrDelete canDeselect isEligible isSelected allocationAmount{__typename displayValue value}statusMessage{__typename messageStatus messageType}paymentType ebtMaxEligibleAmount{__typename displayValue value}cardBalance{__typename displayValue value}}fragment DsCardAllocationFragment on DsCardAllocation{__typename card{...DsCardFields}canEditOrDelete canDeselect isEligible isSelected allocationAmount{__typename displayValue value}statusMessage{__typename messageStatus messageType}paymentType canApplyAmount{__typename displayValue value}remainingBalance{__typename displayValue value}paymentPromotions{__typename programName canApplyAmount{__typename displayValue value}allocationAmount{__typename displayValue value}remainingBalance{__typename displayValue value}balance{__typename displayValue value}termsLink isInvalid}otcShippingBenefit termsLink}fragment DsCardFields on DsCard{__typename id displayLabel lastFour fundingProgram balance{cardBalance}dsCardType cardName}fragment PayPalAllocationFragment on PayPalAllocation{__typename allocationAmount{__typename displayValue value}paymentHandle paymentType email}fragment AffirmAllocationFragment on AffirmAllocation{__typename allocationAmount{__typename displayValue value}paymentHandle paymentType cardType firstName lastName}fragment ErrorFields on TenderPlanError{__typename code message}',
                    variables: {
                        tenderPlanInput: {
                            contractId: contractId,
                            isAmendFlow: false,
                        },
                    },
                };

                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                const tenderPlanId = resp.data['data']['tenderPlan']['tenderPlan']['id'];

                log('Get Tender Plan response %O %s', resp.status, tenderPlanId);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }

                return tenderPlanId;
            } catch (error) {
                log('get tender plan Error');
                this.cancelTask();
                retry = true;

                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async createCreditCard(): Promise<[string, WalmartCreditCard]> {
        let retry = false;
        let headers: any = { ...WALMART_US_CREATE_CREDIT_CARD_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const encryptedCard = await this.encryptCard();

                const body = {
                    query: 'mutation CreateCreditCard($input:AccountCreditCardInput!){createAccountCreditCard(input:$input){errors{code message}creditCard{...CreditCardFragment}}}fragment CreditCardFragment on CreditCard{__typename firstName lastName phone addressLineOne addressLineTwo city state postalCode cardType expiryYear expiryMonth lastFour id isDefault isExpired needVerifyCVV isEditable capOneProperties{shouldPromptForLink}linkedCard{availableCredit currentCreditBalance currentMinimumAmountDue minimumPaymentDueDate statementBalance statementDate rewards{rewardsBalance rewardsCurrency cashValue cashDisplayValue canRedeem}links{linkMethod linkHref linkType}}}',
                    variables: {
                        input: {
                            firstName: this.userProfile.billing.lastName,
                            lastName: this.userProfile.billing.lastName,
                            phone: this.userProfile.billing.phone,
                            address: {
                                addressLineOne: this.userProfile.billing.address,
                                addressLineTwo: null,
                                postalCode: this.userProfile.billing.postalCode,
                                city: this.userProfile.billing.town,
                                state: REGIONS[this.userProfile.billing.country][this.userProfile.billing.region].isocodeShort,
                                isApoFpo: null,
                                isLoadingDockAvailable: null,
                                isPoBox: null,
                                businessName: null,
                                addressType: null,
                                sealedAddress: null,
                            },
                            expiryYear: parseInt(encryptedCard.expiryYear),
                            expiryMonth: parseInt(encryptedCard.expiryMonth),
                            isDefault: false,
                            cardType: 'VISA',
                            integrityCheck: encryptedCard.integrityCheck,
                            keyId: encryptedCard.keyId,
                            phase: encryptedCard.phase,
                            encryptedPan: encryptedCard.number,
                            encryptedCVV: encryptedCard.cvc,
                            sourceFeature: 'ACCOUNT_PAGE',
                            cartId: null,
                            checkoutSessionId: null,
                        },
                    },
                };

                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                log('Create credit card response %s', JSON.stringify(resp.data['data'], null, 4));

                const creditCardId = resp.data['data']['createAccountCreditCard']['creditCard']['id'];

                log('Create credit card response %O %s', resp.status, creditCardId);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }

                return [creditCardId, encryptedCard];
            } catch (error) {
                log('create credit card Error');
                this.cancelTask();
                retry = true;

                await this.emitStatusWithDelay(MESSAGES.CREDIT_CARD_REJECTED, 'error');
            }
        } while (retry);
    }

    async updateTenderPlan(contractId: string, tenderPlanId: string, creditCardId: string): Promise<string> {
        let retry = false;
        let headers: any = { ...WALMART_US_UPDATE_TENDER_PLAN_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'mutation updateTenderPlan($input:UpdateTenderPlanInput!){updateTenderPlan(input:$input){__typename tenderPlan{...TenderPlanFields}errors{...ErrorFields}}}fragment TenderPlanFields on TenderPlan{__typename id contractId grandTotal{...PriceDetailRowFields}authorizationAmount{...PriceDetailRowFields}allocationStatus paymentGroups{...PaymentGroupFields}otcDeliveryBenefit{...PriceDetailRowFields}otherAllowedPayments{type status}addPaymentType hasAmountUnallocated weightDebitTotal{...PriceDetailRowFields}}fragment PriceDetailRowFields on PriceDetailRow{__typename key label displayValue value info{__typename title message}}fragment PaymentGroupFields on TenderPlanPaymentGroup{__typename type subTotal{__typename key label displayValue value info{__typename title message}}selectedCount allocations{...CreditCardAllocationFragment...GiftCardAllocationFragment...EbtCardAllocationFragment...DsCardAllocationFragment...PayPalAllocationFragment...AffirmAllocationFragment}coversOrderTotal statusMessage}fragment CreditCardAllocationFragment on CreditCardAllocation{__typename card{...CreditCardFragment}canEditOrDelete canDeselect isEligible isSelected allocationAmount{__typename displayValue value}capOneReward{...CapOneFields}statusMessage{__typename messageStatus messageType}paymentType}fragment CapOneFields on CapOneReward{credentialId redemptionRate redemptionUrl redemptionMethod rewardPointsBalance rewardPointsSelected rewardAmountSelected}fragment CreditCardFragment on CreditCard{__typename id isDefault cardAccountLinked needVerifyCVV cardType expiryMonth expiryYear isExpired firstName lastName lastFour isEditable phone}fragment GiftCardAllocationFragment on GiftCardAllocation{__typename card{...GiftCardFields}canEditOrDelete canDeselect isEligible isSelected allocationAmount{__typename displayValue value}statusMessage{__typename messageStatus messageType}paymentType remainingBalance{__typename displayValue value}}fragment GiftCardFields on GiftCard{__typename id balance{cardBalance}lastFour displayLabel}fragment EbtCardAllocationFragment on EbtCardAllocation{__typename card{__typename id lastFour firstName lastName}canEditOrDelete canDeselect isEligible isSelected allocationAmount{__typename displayValue value}statusMessage{__typename messageStatus messageType}paymentType ebtMaxEligibleAmount{__typename displayValue value}cardBalance{__typename displayValue value}}fragment DsCardAllocationFragment on DsCardAllocation{__typename card{...DsCardFields}canEditOrDelete canDeselect isEligible isSelected allocationAmount{__typename displayValue value}statusMessage{__typename messageStatus messageType}paymentType canApplyAmount{__typename displayValue value}remainingBalance{__typename displayValue value}paymentPromotions{__typename programName canApplyAmount{__typename displayValue value}allocationAmount{__typename displayValue value}remainingBalance{__typename displayValue value}balance{__typename displayValue value}termsLink isInvalid}otcShippingBenefit termsLink}fragment DsCardFields on DsCard{__typename id displayLabel lastFour fundingProgram balance{cardBalance}dsCardType cardName}fragment PayPalAllocationFragment on PayPalAllocation{__typename allocationAmount{__typename displayValue value}paymentHandle paymentType email}fragment AffirmAllocationFragment on AffirmAllocation{__typename allocationAmount{__typename displayValue value}paymentHandle paymentType cardType firstName lastName}fragment ErrorFields on TenderPlanError{__typename code message}',
                    variables: {
                        input: {
                            contractId: contractId,
                            tenderPlanId: tenderPlanId,
                            payments: [
                                {
                                    paymentType: 'CREDITCARD',
                                    preferenceId: creditCardId,
                                    amount: null,
                                    capOneReward: null,
                                    cardType: null,
                                    paymentHandle: null,
                                },
                            ],
                            accountRefresh: true,
                            isAmendFlow: false,
                        },
                    },
                };

                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                const newTenderPlanId = resp.data['data']['updateTenderPlan']['tenderPlan']['id'];

                log('Update tender plan response %O', resp.status);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }

                return newTenderPlanId;
            } catch (error) {
                log('Update tender plan Error');
                this.cancelTask();
                retry = true;
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async saveTenderPlanPC(contractId: string, tenderPlanId: string): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_SAVE_TENDER_PC_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'mutation saveTenderPlanToPC( $input:SaveTenderPlanToPCInput! $promosEnable:Boolean! $wplusEnabled:Boolean! ){saveTenderPlanToPC(input:$input){...ContractFragment}}fragment ContractFragment on PurchaseContract{id associateDiscountStatus addressMode tenderPlanId papEbtAllowed allowedPaymentGroupTypes cartCustomerContext @include(if:$wplusEnabled){isMembershipOptedIn isEligibleForFreeTrial paymentData{hasCreditCard}}checkoutError{code errorData{__typename...on OutOfStock{offerId}__typename...on UnavailableOffer{offerId}__typename...on ItemExpired{offerId}__typename...on ItemQuantityAdjusted{offerId requestedQuantity adjustedQuantity}}operationalErrorCode message}checkoutableWarnings{code itemIds}allocationStatus payments{id paymentType cardType lastFour isDefault cvvRequired preferenceId paymentPreferenceId paymentHandle expiryMonth expiryYear firstName lastName email amountPaid cardImage cardImageAlt isLinkedCard capOneReward{credentialId redemptionUrl redemptionRate redemptionMethod rewardPointsBalance rewardPointsSelected rewardAmountSelected}remainingBalance{displayValue value}}order{id status orderVersion mobileNumber}terms{alcoholAccepted bagFeeAccepted smsOptInAccepted marketingEmailPrefOptIn}donationDetails{charityEIN charityName amount{displayValue value}acceptDonation}lineItems{...LineItemFields}tippingDetails{suggestedAmounts{value displayValue}maxAmount{value displayValue}selectedTippingAmount{value displayValue}}customer{id firstName lastName isGuest email phone}fulfillment{deliveryDetails{deliveryInstructions deliveryOption}pickupChoices{isSelected fulfillmentType accessType accessMode accessPointId}deliveryAddress{...AddressFields}alternatePickupPerson{...PickupPersonFields}primaryPickupPerson{...PickupPersonFields}fulfillmentItemGroups{...FulfillmentItemGroupsFields}accessPoint{...AccessPointFields}reservation{...ReservationFields}}priceDetails{subTotal{...PriceDetailRowFields}totalItemQuantity fees{...PriceDetailRowFields}taxTotal{...PriceDetailRowFields}grandTotal{...PriceDetailRowFields}belowMinimumFee{...PriceDetailRowFields}authorizationAmount{...PriceDetailRowFields}weightDebitTotal{...PriceDetailRowFields}discounts{...PriceDetailRowFields}otcDeliveryBenefit{...PriceDetailRowFields}ebtSnapMaxEligible{...PriceDetailRowFields}ebtCashMaxEligible{...PriceDetailRowFields}hasAmountUnallocated affirm{__typename message{...AffirmMessageFields}}}checkoutGiftingDetails{isCheckoutGiftingOptin isWalmartProtectionPlanPresent isAppleCarePresent isRestrictedPaymentPresent giftMessageDetails{giftingMessage recipientEmail recipientName senderName}}promotions @include(if:$promosEnable){displayValue promoId terms}showPromotions @include(if:$promosEnable) errors{code message lineItems{...LineItemFields}}}fragment LineItemFields on LineItem{id quantity quantityString quantityLabel accessibilityQuantityLabel isPreOrder fulfillmentSourcingDetails{currentSelection requestedSelection}packageQuantity priceInfo{priceDisplayCodes{showItemPrice priceDisplayCondition finalCostByWeight}itemPrice{displayValue value}linePrice{displayValue value}preDiscountedLinePrice{displayValue value}wasPrice{displayValue value}unitPrice{displayValue value}}isSubstitutionSelected isGiftEligible selectedVariants{name value}product{id name usItemId itemType imageInfo{thumbnailUrl}offerId orderLimit orderMinLimit weightIncrement weightUnit averageWeight salesUnitType availabilityStatus isSubstitutionEligible isAlcohol configuration hasSellerBadge sellerId sellerName sellerType preOrder{...preOrderFragment}addOnServices{serviceType groups{groupType services{selectedDisplayName offerId currentPrice{priceString}}}}}discounts{key label displayValue @include(if:$promosEnable) displayLabel @include(if:$promosEnable)}wirelessPlan{planId mobileNumber __typename postPaidPlan{...postpaidPlanDetailsFragment}}selectedAddOnServices{offerId quantity groupType}registryInfo{registryId registryType}}fragment postpaidPlanDetailsFragment on PostPaidPlan{__typename espOrderSummaryId espOrderId espOrderLineId warpOrderId warpSessionId devicePayment{...postpaidPlanPriceFragment}devicePlan{__typename price{...postpaidPlanPriceFragment}frequency duration annualPercentageRate}deviceDataPlan{...deviceDataPlanFragment}}fragment deviceDataPlanFragment on DeviceDataPlan{__typename carrierName planType expiryTime activationFee{...postpaidPlanPriceFragment}planDetails{__typename price{...postpaidPlanPriceFragment}frequency name}agreements{...agreementFragment}}fragment postpaidPlanPriceFragment on PriceDetailRow{__typename key label displayValue value strikeOutDisplayValue strikeOutValue info{__typename title message}}fragment agreementFragment on CarrierAgreement{__typename name type format value docTitle label}fragment preOrderFragment on PreOrder{streetDate streetDateDisplayable streetDateType isPreOrder preOrderMessage preOrderStreetDateMessage}fragment AddressFields on Address{id addressLineOne addressLineTwo city state postalCode firstName lastName phone}fragment PickupPersonFields on PickupPerson{id firstName lastName email}fragment PriceDetailRowFields on PriceDetailRow{__typename key label displayValue value strikeOutValue strikeOutDisplayValue info{__typename title message}}fragment AccessPointFields on AccessPoint{id name assortmentStoreId displayName timeZone address{id addressLineOne addressLineTwo city state postalCode firstName lastName phone}isTest allowBagFee bagFeeValue isExpressEligible fulfillmentOption instructions nodeAccessType}fragment ReservationFields on Reservation{id expiryTime isUnscheduled expired showSlotExpiredError reservedSlot{__typename...on RegularSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata slotExpiryTime endTime available supportedTimeZone}...on DynamicExpressSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime endTime fulfillmentType slotMetadata slotExpiryTime available slaInMins maxItemAllowed supportedTimeZone}...on UnscheduledSlot{price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata unscheduledHoldInDays supportedTimeZone}...on InHomeSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata slotExpiryTime endTime available supportedTimeZone}}}fragment AffirmMessageFields on AffirmMessage{__typename description termsUrl imageUrl monthlyPayment termLength isZeroAPR}fragment FulfillmentItemGroupsFields on FulfillmentItemGroup{...on SCGroup{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on DigitalDeliveryGroup{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}}...on Unscheduled{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on FCGroup{__typename defaultMode collapsedItemIds startDate endDate isUnscheduledDeliveryEligible shippingOptions{__typename itemIds availableShippingOptions{__typename id shippingMethod deliveryDate price{__typename displayValue value}label{prefix suffix}isSelected isDefault}}hasMadeShippingChanges slaGroups{__typename label deliveryDate warningLabel sellerGroups{__typename id name isProSeller type shipOptionGroup{__typename deliveryPrice{__typename displayValue value}itemIds shipMethod}}}}...on AutoCareCenter{__typename defaultMode startDate endDate accBasketType collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}}',
                    variables: {
                        input: {
                            contractId: contractId,
                            tenderPlanId: tenderPlanId,
                        },
                        promosEnable: true,
                        wplusEnabled: true,
                    },
                };

                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                log('Save tender plan response %O', resp.status);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }
            } catch (error) {
                log('Save tender plan Error');
                this.cancelTask();
                retry = true;
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async placeOrder(contractId: string, creditCardId, encCard: WalmartCreditCard): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_PLACE_ORDER_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.PLACING_ORDER_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'mutation PlaceOrder( $placeOrderInput:PlaceOrderInput! $promosEnable:Boolean! $wplusEnabled:Boolean! ){placeOrder(input:$placeOrderInput){...ContractFragment}}fragment ContractFragment on PurchaseContract{id associateDiscountStatus addressMode tenderPlanId papEbtAllowed allowedPaymentGroupTypes cartCustomerContext @include(if:$wplusEnabled){isMembershipOptedIn isEligibleForFreeTrial paymentData{hasCreditCard}}checkoutError{code errorData{__typename...on OutOfStock{offerId}__typename...on UnavailableOffer{offerId}__typename...on ItemExpired{offerId}__typename...on ItemQuantityAdjusted{offerId requestedQuantity adjustedQuantity}}operationalErrorCode message}checkoutableWarnings{code itemIds}allocationStatus payments{id paymentType cardType lastFour isDefault cvvRequired preferenceId paymentPreferenceId paymentHandle expiryMonth expiryYear firstName lastName email amountPaid cardImage cardImageAlt isLinkedCard capOneReward{credentialId redemptionUrl redemptionRate redemptionMethod rewardPointsBalance rewardPointsSelected rewardAmountSelected}remainingBalance{displayValue value}}order{id status orderVersion mobileNumber}terms{alcoholAccepted bagFeeAccepted smsOptInAccepted marketingEmailPrefOptIn}donationDetails{charityEIN charityName amount{displayValue value}acceptDonation}lineItems{...LineItemFields}tippingDetails{suggestedAmounts{value displayValue}maxAmount{value displayValue}selectedTippingAmount{value displayValue}}customer{id firstName lastName isGuest email phone}fulfillment{deliveryDetails{deliveryInstructions deliveryOption}pickupChoices{isSelected fulfillmentType accessType accessMode accessPointId}deliveryAddress{...AddressFields}alternatePickupPerson{...PickupPersonFields}primaryPickupPerson{...PickupPersonFields}fulfillmentItemGroups{...FulfillmentItemGroupsFields}accessPoint{...AccessPointFields}reservation{...ReservationFields}}priceDetails{subTotal{...PriceDetailRowFields}totalItemQuantity fees{...PriceDetailRowFields}taxTotal{...PriceDetailRowFields}grandTotal{...PriceDetailRowFields}belowMinimumFee{...PriceDetailRowFields}authorizationAmount{...PriceDetailRowFields}weightDebitTotal{...PriceDetailRowFields}discounts{...PriceDetailRowFields}otcDeliveryBenefit{...PriceDetailRowFields}ebtSnapMaxEligible{...PriceDetailRowFields}ebtCashMaxEligible{...PriceDetailRowFields}hasAmountUnallocated affirm{__typename message{...AffirmMessageFields}}}checkoutGiftingDetails{isCheckoutGiftingOptin isWalmartProtectionPlanPresent isAppleCarePresent isRestrictedPaymentPresent giftMessageDetails{giftingMessage recipientEmail recipientName senderName}}promotions @include(if:$promosEnable){displayValue promoId terms}showPromotions @include(if:$promosEnable) errors{code message lineItems{...LineItemFields}}}fragment LineItemFields on LineItem{id quantity quantityString quantityLabel accessibilityQuantityLabel isPreOrder fulfillmentSourcingDetails{currentSelection requestedSelection}packageQuantity priceInfo{priceDisplayCodes{showItemPrice priceDisplayCondition finalCostByWeight}itemPrice{displayValue value}linePrice{displayValue value}preDiscountedLinePrice{displayValue value}wasPrice{displayValue value}unitPrice{displayValue value}}isSubstitutionSelected isGiftEligible selectedVariants{name value}product{id name usItemId itemType imageInfo{thumbnailUrl}offerId orderLimit orderMinLimit weightIncrement weightUnit averageWeight salesUnitType availabilityStatus isSubstitutionEligible isAlcohol configuration hasSellerBadge sellerId sellerName sellerType preOrder{...preOrderFragment}addOnServices{serviceType groups{groupType services{selectedDisplayName offerId currentPrice{priceString}}}}}discounts{key label displayValue @include(if:$promosEnable) displayLabel @include(if:$promosEnable)}wirelessPlan{planId mobileNumber __typename postPaidPlan{...postpaidPlanDetailsFragment}}selectedAddOnServices{offerId quantity groupType}registryInfo{registryId registryType}}fragment postpaidPlanDetailsFragment on PostPaidPlan{__typename espOrderSummaryId espOrderId espOrderLineId warpOrderId warpSessionId devicePayment{...postpaidPlanPriceFragment}devicePlan{__typename price{...postpaidPlanPriceFragment}frequency duration annualPercentageRate}deviceDataPlan{...deviceDataPlanFragment}}fragment deviceDataPlanFragment on DeviceDataPlan{__typename carrierName planType expiryTime activationFee{...postpaidPlanPriceFragment}planDetails{__typename price{...postpaidPlanPriceFragment}frequency name}agreements{...agreementFragment}}fragment postpaidPlanPriceFragment on PriceDetailRow{__typename key label displayValue value strikeOutDisplayValue strikeOutValue info{__typename title message}}fragment agreementFragment on CarrierAgreement{__typename name type format value docTitle label}fragment preOrderFragment on PreOrder{streetDate streetDateDisplayable streetDateType isPreOrder preOrderMessage preOrderStreetDateMessage}fragment AddressFields on Address{id addressLineOne addressLineTwo city state postalCode firstName lastName phone}fragment PickupPersonFields on PickupPerson{id firstName lastName email}fragment PriceDetailRowFields on PriceDetailRow{__typename key label displayValue value strikeOutValue strikeOutDisplayValue info{__typename title message}}fragment AccessPointFields on AccessPoint{id name assortmentStoreId displayName timeZone address{id addressLineOne addressLineTwo city state postalCode firstName lastName phone}isTest allowBagFee bagFeeValue isExpressEligible fulfillmentOption instructions nodeAccessType}fragment ReservationFields on Reservation{id expiryTime isUnscheduled expired showSlotExpiredError reservedSlot{__typename...on RegularSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata slotExpiryTime endTime available supportedTimeZone}...on DynamicExpressSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime endTime fulfillmentType slotMetadata slotExpiryTime available slaInMins maxItemAllowed supportedTimeZone}...on UnscheduledSlot{price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata unscheduledHoldInDays supportedTimeZone}...on InHomeSlot{id price{total{displayValue}expressFee{displayValue}baseFee{displayValue}memberBaseFee{displayValue}}accessPointId fulfillmentOption startTime fulfillmentType slotMetadata slotExpiryTime endTime available supportedTimeZone}}}fragment AffirmMessageFields on AffirmMessage{__typename description termsUrl imageUrl monthlyPayment termLength isZeroAPR}fragment FulfillmentItemGroupsFields on FulfillmentItemGroup{...on SCGroup{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on DigitalDeliveryGroup{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}}...on Unscheduled{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on FCGroup{__typename defaultMode collapsedItemIds startDate endDate isUnscheduledDeliveryEligible shippingOptions{__typename itemIds availableShippingOptions{__typename id shippingMethod deliveryDate price{__typename displayValue value}label{prefix suffix}isSelected isDefault}}hasMadeShippingChanges slaGroups{__typename label deliveryDate warningLabel sellerGroups{__typename id name isProSeller type shipOptionGroup{__typename deliveryPrice{__typename displayValue value}itemIds shipMethod}}}}...on AutoCareCenter{__typename defaultMode startDate endDate accBasketType collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}}',
                    variables: {
                        placeOrderInput: {
                            contractId: contractId,
                            substitutions: [],
                            acceptBagFee: null,
                            acceptAlcoholDisclosure: null,
                            acceptSMSOptInDisclosure: null,
                            marketingEmailPref: null,
                            deliveryDetails: {
                                deliveryInstructions: null,
                                deliveryOption: 'LEAVE_AT_DOOR',
                            },
                            mobileNumber: this.userProfile.billing.phone,
                            paymentCvvInfos: [
                                {
                                    preferenceId: creditCardId,
                                    paymentType: 'CREDITCARD',
                                    integrityCheck: encCard.integrityCheck,
                                    keyId: encCard.keyId,
                                    phase: encCard.phase,
                                    encryptedPan: encCard.number,
                                    encryptedCvv: encCard.cvc,
                                },
                            ],
                            paymentHandle: null,
                            acceptDonation: false,
                            emailAddress: this.userProfile.billing.email,
                            fulfillmentOptions: null,
                            acceptedAgreements: [],
                        },
                        promosEnable: true,
                        wplusEnabled: true,
                    },
                };
                log('Placing payment');
                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                log('Payment resp %O', resp.status);
            } catch (error) {
                log('Payment Failed');
                this.cancelTask();
                retry = true;
                await this.emitStatusWithDelay(MESSAGES.PLACING_ORDER_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async purchaseContract(contractId: string): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_PURCHASE_CONTRACT_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    query: 'query PurchaseContract( $input:PurchaseContractInput! $shouldFetchMembershipData:Boolean! ){membership @include(if:$shouldFetchMembershipData){status savings{money}plan{benefits{code}}}membershipTrialExtension @include(if:$shouldFetchMembershipData){daysEligible}purchaseContract(input:$input){id checkoutGiftingDetails{isCheckoutGiftingOptin giftMessageDetails{giftingMessage recipientEmail recipientName senderName}}payments{id paymentType cardType lastFour isDefault cvvRequired preferenceId expiryMonth expiryYear}order{id status orderVersion mobileNumber ebtSnapBalance{displayValue}ebtCashBalance{displayValue}}terms{alcoholAccepted bagFeeAccepted smsOptInAccepted}lineItems{...LineItemFields}addressMode customer{id firstName lastName email isGuest isEmailRegistered}fulfillment{storeId pickupChoices{isSelected accessType}deliveryDetails{deliveryInstructions deliveryOption}deliveryAddress{...AddressFields}alternatePickupPerson{...PickupPersonFields}primaryPickupPerson{...PickupPersonFields}fulfillmentItemGroups{...on SCGroup{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on AutoCareCenter{__typename defaultMode startDate endDate accBasketType collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on Unscheduled{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}accessPoint{...AccessPointFields}reservation{...ReservationFields}}...on DigitalDeliveryGroup{__typename defaultMode collapsedItemIds itemGroups{__typename label itemIds}}...on FCGroup{__typename defaultMode collapsedItemIds startDate endDate isUnscheduledDeliveryEligible shippingOptions{__typename itemIds availableShippingOptions{__typename id shippingMethod deliveryDate price{__typename displayValue value}label{prefix suffix}isSelected isDefault}}hasMadeShippingChanges slaGroups{__typename label deliveryDate sellerGroups{__typename id name isProSeller type shipOptionGroup{__typename deliveryPrice{__typename displayValue value}itemIds shipMethod}}}}}}priceDetails{subTotal{...PriceDetailRowFields}totalItemQuantity fees{...PriceDetailRowFields}taxTotal{...PriceDetailRowFields}grandTotal{...PriceDetailRowFields}authorizationAmount{value}discounts{...PriceDetailRowFields}}checkoutError{code message operationalErrorCode}errors{code message lineItems{...LineItemFields}}}}fragment AddressFields on Address{id addressLineOne addressLineTwo city state postalCode firstName lastName phone}fragment PickupPersonFields on PickupPerson{id firstName lastName email}fragment LineItemFields on LineItem{id quantity quantityString quantityLabel accessibilityQuantityLabel priceInfo{priceDisplayCodes{showItemPrice priceDisplayCondition finalCostByWeight}itemPrice{displayValue value}linePrice{displayValue value}wasPrice{displayValue value}unitPrice{displayValue value}}selectedAddOnServices{offerId quantity groupType}discounts{key value displayLabel displayValue}isSubstitutionSelected selectedVariants{name value}registryInfo{registryId registryType}product{id name usItemId imageInfo{thumbnailUrl}addOnServices{serviceType groups{groupType services{manufacturerName}}}offerId orderLimit orderMinLimit weightIncrement weightUnit averageWeight salesUnitType availabilityStatus isSubstitutionEligible isAlcohol hasSellerBadge sellerId sellerName sellerType}}fragment PriceDetailRowFields on PriceDetailRow{label displayValue value key}fragment AccessPointFields on AccessPoint{id name timeZone address{...AddressFields}isTest allowBagFee bagFeeValue isExpressEligible fulfillmentOption fulfillmentType nodeAccessType displayName assortmentStoreId instructions}fragment ReservationFields on Reservation{id expired expiryTime isUnscheduled reservedSlot{...on RegularSlot{id endTime fulfillmentOption fulfillmentType slotExpiryTime startTime supportedTimeZone allowedAmendTime __typename}...on DynamicExpressSlot{id endTime fulfillmentOption fulfillmentType slaInMins slotExpiryTime startTime supportedTimeZone allowedAmendTime __typename}...on UnscheduledSlot{fulfillmentOption fulfillmentType startTime supportedTimeZone __typename unscheduledHoldInDays}...on InHomeSlot{id endTime fulfillmentOption fulfillmentType slotExpiryTime startTime supportedTimeZone allowedAmendTime __typename}}}',
                    variables: {
                        input: {
                            purchaseContractId: contractId,
                            orderId: null,
                        },
                        shouldFetchMembershipData: false,
                    },
                };
                log('Purchasing item !!');
                const resp = await this.axiosSession.post('/orchestra/cartxo/graphql', body, { headers: headers });

                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                log('Purchase resp %O', resp);

                this.emit(TASK_SUCCESS, {
                    message: MESSAGES.CHECKOUT_SUCCESS_MESSAGE,
                    level: 'success',
                });
            } catch (error) {
                log('Purchase Failed');
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.CHECKOUT_FAILED_MESSAGE, 'fail');
            }
        } while (retry);
    }

    private async encryptCard(): Promise<WalmartCreditCard> {
        const ccEncryptor = new WalmartEncryption();

        const encCard = await ccEncryptor.encrypt(this.userProfile.payment);

        return encCard;
    }

    /*
    Walmart prompts a captcha with a 412 HTTP status code and a json object containing information to render the captcha
    captchaResponse should be in this format : 
    {
        "redirectUrl": "",
        "appId": "",
        "jsClientSrc": "",
        "firstPartyEnabled": true,
        "vid": "",
        "uuid": "",
        "hostUrl": "",
        "blockScript": ""
    }
    This function will wait for the user to solve the captcha
    */
    private async dispatchCaptcha(captchaResponse: any): Promise<void> {
        this.emit(TASK_STATUS, { message: MESSAGES.WAIT_CAPTCHA_MESSAGE, level: 'captcha' });

        this.emit(NOTIFY_CAPTCHA_TASK, {
            uuid: this.uuid,
            params: captchaResponse,
        });

        const waitCap = this.waitForCaptcha();
        this.cancelTimeout = waitCap.cancel;
        await waitCap.promise;
    }

    // Walmart graphQL api returns a successful response inside an object with the `data` key
    // An error response is returned inside an array with the `errors` key
    protected createErrorInterceptor(): void {
        this.axiosSession.interceptors.response.use(
            (response) => {
                if (response.data['errors']) return Promise.reject(response);
                return response;
            },
            async (error) => {
                if (error.response) {
                    log('Error %s', JSON.stringify(error.response, null, 4));
                    // Captcha
                    if (error.response.status === 412) {
                        log('Dispatching Captcha');
                        // await this.dispatchCaptcha(error.response.data);
                        return Promise.reject(new CaptchaException('Walmart US Captcha Exception', error.response));
                    }
                }
                return Promise.reject(error);
            },
        );
    }
}
