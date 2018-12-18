/* eslint-disable no-console */
/* eslint no-use-before-define: ["error", {"functions": false}] */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-arrow-callback */

const Alexa = require('ask-sdk');

/*
    Static list of facts across 3 categories that serve as
    the free and premium content served by the Skill
*/
const ALL_FACTS = [
  { type: 'hulk', fact: 'The Hulk once unleashed all of his power and destroyed a planet with a single punch.' },
  { type: 'hulk', fact: 'The Hulk was inspired by a real woman who lifted a car to save her baby. According to the creator Jack Kirby This woman proved to me that the ordinary person in desperate circumstances can transcend himself and do things that he wouldnt ordinarily do.' },
  { type: 'hulk', fact: 'The Hulk has been seen on the ocean floor breathing underwater a number of times. He’s able to breathe underwater due to his body developing a gland that creates an oxygenated perfluorocarbon emulsion which fills his lungs and equalizes the pressure.' },
  { type: 'hulk', fact: 'He once stomped on the ground so hard that he created a shockwave that destroyed an entire city and caused massive damage for miles.' },
  { type: 'hulk', fact: 'Skaar is the son of Hulk. His physical strength is so high that he cracked the armor of the Juggernaut and sent him into the outer atmosphere with one punch, which is something that was considered impossible.' },
  { type: 'hulk', fact: 'Thanos repeatedly mentions that the Hulk is one of the few beings he actively avoids conflicts with.' },
  { type: 'hulk', fact: 'In a scene cut from the 2008 The Incredible Hulk movie Bruce Banner goes to the Arctic to commit suicide and Captain Americas body and shield can be spotted frozen beneath the ice.' },
  { type: 'hulk', fact: 'In the Planet Hulk storyline a doomsday device is triggered and the planets tectonic plates are ripped apart. The Hulk jumped into a river of lava and then grabbed the tectonic plates and put them back together.' },
  { type: 'hulk', fact: 'Professor X once tried to control World War Hulks mind but was unable to. He said that Hulks rage was like an elemental force he couldnt overcome.' },
  { type: 'hulk', fact: 'Hulk once ruled an entire planet as king. After his capital city was destroyed and his pregnant wife killed he invaded the Earth believing the heroes to be responsible.' },
  { type: 'ironman', fact: 'Jon Favreau wanted Robert Downey Jr because he felt the actors past was right for the part. He commented The best and worst moments of Roberts life have been in the public eye. He had to find an inner balance to overcome obstacles that went far beyond his career. Thats Tony Stark. Robert brings a depth that goes beyond a comic book character having trouble in high school, or cant get the girl. Favreau also felt Downey could make Stark a likable asshole, but also depict an authentic emotional journey once he won over the audience.' },
  { type: 'ironman', fact: 'Rhodeys ringtone for when Tony Stark calls him is a midi version of the theme music to the 1966 Iron Man cartoon.' },
  { type: 'ironman', fact: 'Roughly 450 separate pieces make up the Iron Man suit.' },
  { type: 'ironman', fact: 'The montage of Tony Starks life story was created by editor Kyle Cooper, and contains real life photos of a young Robert Downey Jr. and his father Robert Downey Sr.' },
  { type: 'ironman', fact: 'Tony Starks computer system is called JARVIS standing for Just A Rather Very Intelligent System. This is a tribute to Edwin Jarvis Howard Starks butler. He was changed to an artificial intelligence to avoid comparisons to Batman Bruce Waynes butler Alfred Pennyworth.' },
  { type: 'ironman', fact: 'To prepare for his role as Iron Man, Robert Downey Jr. spent five days a week weight training and practiced martial arts to get into shape.' },
  { type: 'ironman', fact: 'Jon Favreau shot the film in California because he felt that too many superhero films were set on the East Coast especially New York City.' },
  { type: 'ironman', fact: 'This is Marvel Studios first self financed movie.' },
  { type: 'ironman', fact: 'An early draft of the script had the Mandarin appear in the film reimagined as an Indonesian terrorist.' },
  { type: 'ironman', fact: 'In the scene where Pepper discovers Tony removing the damaged Iron Man armor  you can clearly see Captain Americas shield on a workbench. This same scene was shown in many trailers but the image of the shield was edited out.' },
  { type: 'thor', fact: 'Thor made his first appearance in an August 1962 issue of Journey into Mystery That same month Spider Man was also introduced to the world.' },
  { type: 'thor', fact: 'Within a few years Thor became so popular that Marvel had the characters full title trademarked as The Mighty Thor. Fortunately The Sexually Inadequate Thor is still up for grabs.' },
  { type: 'thor', fact: 'According to Norse mythology Thor and his fellow Gods are granted immortality by eating magic apples that only grow in Asgard. In keeping with the mythology in the comics Thor would return to Asgard periodically for some of those sweet apples proving that apples arent all that bad.' },
  { type: 'thor', fact: 'As a prank Loki once transformed Thor into a frog. An actual frog. Thor subsequently participated in a rats vs. frogs war in New Yorks Central Park. Even when he got his hammer back, he transformed back only half way, to a frog man. Fellow god and humorless friend Volstagg ultimately returned Thor to his fully normal self.' },
  { type: 'thor', fact: 'Thors iconic weapon, the magic hammer Mjolnir, was said to be forged in the heart of a dying star. This actually makes some scientific sense as a dying star creates an incredibly dense type of matter nicknamed neutronium a single teaspoon of which would weigh billions of tons.' },
  { type: 'thor', fact: 'Stan Lee specifically placed a hyphen in thors name to prevent thor and Superman to be mixed up as Superman was rather popular at the time.' },
  { type: 'thor', fact: 'The hammer of Thor can only be wielded by those who are worthy. However in the comics, there are a long line of those who qualify including an alien named Beta Ray Bill. During a fight, Bill managed to grab Mjolnir which deemed him worthy. They were both transported back to Asgard where Odin had the two fight it out to see who got to keep the hammer. Bill won, but being the upstanding guy he is, refused to kill Thor. Odin gave Mjolnir back to Thor and made a new hammer for Bill.' },
  { type: 'thor', fact: 'A sliver of Mjolnir was actually wielded by Throg formerly known as Puddlegulp a football player who had been turned into a frog and assisted Thor during his time as an amphibian.' },
  { type: 'thor', fact: 'Superman was able to temporarily wield the hammer when Odin lifted the enchantment for a brief moment so he could deal a killing blow to the near-omnipotent Krona. The hammer stopped working for him shortly after that because Superman does not have the heart of a warrior.' },
  { type: 'thor', fact: 'Before being deemed worthy enough to use Mjolnir Thor wielded Jarnbjorn a giant indestructible axe with the power to deflect energy blasts and cut through almost everything which unfortunately included his own arm.' },
];

const skillName = 'unofficial marvel facts';

/*
    Function to demonstrate how to filter inSkillProduct list to get list of
    all entitled products to render Skill CX accordingly
*/
function getAllEntitledProducts(inSkillProductList) {
  const entitledProductList = inSkillProductList.filter(record => record.entitled === 'ENTITLED');
  return entitledProductList;
}

function getRandomFact(facts) {
  const factIndex = Math.floor(Math.random() * facts.length);
  return facts[factIndex].fact;
}

function getRandomYesNoQuestion() {
  const questions = ['Would you like another fact?', 'Can I tell you another fact?', 'Do you want to hear another fact?'];
  return questions[Math.floor(Math.random() * questions.length)];
}

function getRandomGoodbye() {
  const goodbyes = ['OK.  Goodbye!', 'Have a great day!', 'Come back again soon!'];
  return goodbyes[Math.floor(Math.random() * goodbyes.length)];
}

/*
    Helper function that returns a speakable list of product names from a list of
    entitled products.
*/
function getSpeakableListOfProducts(entitleProductsList) {
  const productNameList = entitleProductsList.map(item => item.name);
  let productListSpeech = productNameList.join(', '); // Generate a single string with comma separated product names
  productListSpeech = productListSpeech.replace(/_([^_]*)$/, 'and $1'); // Replace last comma with an 'and '
  return productListSpeech;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log('IN LAUNCHREQUEST');

    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(
      function reportPurchasedProducts(result) {
        const entitledProducts = getAllEntitledProducts(result.inSkillProducts);
        if (entitledProducts && entitledProducts.length > 0) {
          // Customer owns one or more products

          return handlerInput.responseBuilder
            .speak(`Welcome to ${skillName}. You currently own ${getSpeakableListOfProducts(entitledProducts)}` +
              ' products. To hear a random fact, you could say, \'Tell me a fact\' or you can ask' +
              ' for a specific category you have purchased, for example, say \'Tell me a thor fact\'. ' +
              ' To know what else you can buy, say, \'What can i buy?\'. So, what can I help you' +
              ' with?')
            .reprompt('I didn\'t catch that. What can I help you with?')
            .getResponse();
        }

        // Not entitled to anything yet.
        console.log('No entitledProducts');
        return handlerInput.responseBuilder
          .speak(`Welcome to ${skillName}. To hear a random fact you can say 'Tell me a fact',` +
            ' or to hear about the premium categories for purchase, say \'What can I buy\'. ' +
            ' For help, say , \'Help me\'... So, What can I help you with?')
          .reprompt('I didn\'t catch that. What can I help you with?')
          .getResponse();
      },
      function reportPurchasedProductsError(err) {
        console.log(`Error calling InSkillProducts API: ${err}`);

        return handlerInput.responseBuilder
          .speak('Something went wrong in loading your purchase history')
          .getResponse();
      },
    );
  },
}; // End LaunchRequestHandler

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    console.log('In HelpHandler');

    const factText = getRandomFact(ALL_FACTS);
    return handlerInput.responseBuilder
      .speak(`What can I help you with? please say yes for a fact`)
      .reprompt(getRandomYesNoQuestion())
      .getResponse();
  },
};

const GetFactHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetFactIntent';
  },
  handle(handlerInput) {
    console.log('In GetFactHandler');

    const factText = getRandomFact(ALL_FACTS);
    return handlerInput.responseBuilder
      .speak(`Here's your random fact: ${factText} ${getRandomYesNoQuestion()}`)
      .reprompt(getRandomYesNoQuestion())
      .getResponse();
  },
};

// IF THE USER SAYS YES, THEY WANT ANOTHER FACT.
const YesHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    console.log('In YesHandler');

    const speakResponse = `Here's your random fact: ${getRandomFact(ALL_FACTS)} ${getRandomYesNoQuestion()}`;
    const repromptResponse = getRandomYesNoQuestion();

    return handlerInput.responseBuilder
      .speak(speakResponse)
      .reprompt(repromptResponse)
      .getResponse();
  },
};

// IF THE USER SAYS NO, THEY DON'T WANT ANOTHER FACT.  EXIT THE SKILL.
const NoHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    console.log('IN NOHANDLER');

    const speakResponse = getRandomGoodbye();
    return handlerInput.responseBuilder
      .speak(speakResponse)
      .getResponse();
  },
};


const GetCategoryFactHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetCategoryFactIntent';
  },
  handle(handlerInput) {
    console.log('In GetCategoryFactHandler');

    const factCategory = getResolvedValue(handlerInput.requestEnvelope, 'factCategory');
    console.log(`FACT CATEGORY = XX ${factCategory} XX`);
    let categoryFacts = ALL_FACTS;

    // IF THERE WAS NOT AN ENTITY RESOLUTION MATCH FOR THIS SLOT VALUE
    if (factCategory === undefined) {
      const slotValue = getSpokenValue(handlerInput.requestEnvelope, 'factCategory');
      let speakPrefix = '';
      if (slotValue !== undefined) speakPrefix = `I heard you say ${slotValue}. `;
      const speakResponse = `${speakPrefix} I don't have facts for that category.  You can ask for thor, hulk, or ironman facts.  Which one would you like?`;
      const repromptResponse = 'Which fact category would you like?  I have thor, hulk, or ironman.';

      return handlerInput.responseBuilder
        .speak(speakResponse)
        .reprompt(repromptResponse)
        .getResponse();
    }
    // IF THERE WAS AN ENTITY RESOLUTION MATCH FOR THIS SLOT VALUE
    categoryFacts = ALL_FACTS.filter(record => record.type === factCategory);
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function checkForProductAccess(result) {
      const subscription = result.inSkillProducts.filter(record => record.referenceName === 'all_access');
      const categoryProduct = result.inSkillProducts.filter(record => record.referenceName === `${factCategory}_pack`);

      // IF USER HAS ACCESS TO THIS PRODUCT
      if (isEntitled(subscription) || isEntitled(categoryProduct)) {
        const speakResponse = `Here's your ${factCategory} fact: ${getRandomFact(categoryFacts)} ${getRandomYesNoQuestion()}`;
        const repromptResponse = getRandomYesNoQuestion();

        return handlerInput.responseBuilder
          .speak(speakResponse)
          .reprompt(repromptResponse)
          .getResponse();
      }
      const upsellMessage = `You don't currently own the ${factCategory} pack. ${categoryProduct[0].summary} Want to learn more?`;

      return handlerInput.responseBuilder
        .addDirective({
          type: 'Connections.SendRequest',
          name: 'Upsell',
          payload: {
            InSkillProduct: {
              productId: categoryProduct[0].productId,
            },
            upsellMessage,
          },
          token: 'correlationToken',
        })
        .getResponse();
    });
  },
};


// Following handler demonstrates how skills can hanlde user requests to discover what
// products are available for purchase in-skill.
// Use says: Alexa, ask Premium facts what can i buy
const ShoppingHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ShoppingIntent';
  },
  handle(handlerInput) {
    console.log('In Shopping Handler');

    // Inform the user aboutwhat products are available for purchase

    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function fetchPurchasableProducts(result){
      const entitledProducts = getAllEntitledProducts(result.inSkillProducts);
      if (entitledProducts && entitledProducts.length == 3) {
        // Customer owns one or more products
        console.log('No entitledProducts');
        const purchasableProducts = result.inSkillProducts.filter(record => record.entitled === 'NOT_ENTITLED' && record.purchasable === 'PURCHASABLE');

        return handlerInput.responseBuilder
          .speak(`Products available for purchase at this time are , you have bought all of the products` +
            '. To learn more about a product, say \'Tell me more about\' followed by the product name. ' +
            ' If you are ready to buy say \'Buy\' followed by the product name. So what can I help you with?')
          .reprompt('I didn\'t catch that. What can I help you with?')
          .getResponse();
      }
      else{
      // Not entitled to anything yet.


        const purchasableProducts = result.inSkillProducts.filter(record => record.entitled === 'NOT_ENTITLED' && record.purchasable === 'PURCHASABLE');

        return handlerInput.responseBuilder
          .speak(`Products available for purchase at this time are ${getSpeakableListOfProducts(purchasableProducts)}` +
            '. To learn more about a product, say \'Tell me more about\' followed by the product name. ' +
            ' If you are ready to buy say \'Buy\' followed by the product name. So what can I help you with?')
          .reprompt('I didn\'t catch that. What can I help you with?')
          .getResponse();

}


    });
  },
};

// Following handler demonstrates how skills can hanlde user requests to discover what
// products are available for purchase in-skill.
// Use says: Alexa, ask Premium facts what can i buy
const ProductDetailHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ProductDetailIntent';
  },
  handle(handlerInput) {
    console.log('IN PRODUCT DETAIL HANDLER');

    // Describe the requested product to the user using localized information
    // from the entitlements API

    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function fetchProductDetails(result) {
      let productCategory = getResolvedValue(handlerInput.requestEnvelope, 'productCategory');

      // NO ENTITY RESOLUTION MATCH
      if (productCategory === undefined) {
        return handlerInput.responseBuilder
          .speak('I don\'t think we have a product by that name.  Can you try again?')
          .reprompt('I didn\'t catch that. Can you try again?')
          .getResponse();
      }

      if (productCategory !== 'all_access') productCategory += '_pack';

      const product = result.inSkillProducts
        .filter(record => record.referenceName === productCategory);

      if (isProduct(product)) {
        const speakResponse = `${product[0].summary}. To buy it, say Buy ${product[0].name}. `;
        const repromptResponse = `I didn't catch that. To buy ${product[0].name}, say Buy ${product[0].name}. `;
        return handlerInput.responseBuilder
          .speak(speakResponse)
          .reprompt(repromptResponse)
          .getResponse();
      }
      return handlerInput.responseBuilder
        .speak('I don\'t think we have a product by that name.  Can you try again?')
        .reprompt('I didn\'t catch that. Can you try again?')
        .getResponse();
    });
  },
};

// Following handler demonstrates how Skills would recieve Buy requests from customers
// and then trigger a Purchase flow request to Alexa
const BuyHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'BuyIntent';
  },
  handle(handlerInput) {
    console.log('IN BUYINTENTHANDLER');

    // Inform the user about what products are available for purchase

    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function initiatePurchase(result) {
      let productCategory = getResolvedValue(handlerInput.requestEnvelope, 'productCategory');

      // NO ENTITY RESOLUTION MATCH
      if (productCategory === undefined) {
        productCategory = 'all_access';
      } else {
        productCategory += '_pack';
      }

      const product = result.inSkillProducts
        .filter(record => record.referenceName === productCategory);

      return handlerInput.responseBuilder
        .addDirective({
          type: 'Connections.SendRequest',
          name: 'Buy',
          payload: {
            InSkillProduct: {
              productId: product[0].productId,
            },
          },
          token: 'correlationToken',
        })
        .getResponse();
    });
  },
};

// Following handler demonstrates how Skills would receive Cancel requests from customers
// and then trigger a cancel request to Alexa
// User says: Alexa, ask <skill name> to cancel <product name>
const CancelSubscriptionHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'CancelSubscriptionIntent';
  },
  handle(handlerInput) {
    console.log('IN CANCELINTENTHANDLER');

    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function initiateCancel(result) {
      let productCategory = getResolvedValue(handlerInput.requestEnvelope, 'productCategory');

      if (productCategory === undefined) {
        productCategory = 'all_access';
      } else {
        productCategory += '_pack';
      }

      const product = result.inSkillProducts
        .filter(record => record.referenceName === productCategory);

      return handlerInput.responseBuilder
        .addDirective({
          type: 'Connections.SendRequest',
          name: 'Cancel',
          payload: {
            InSkillProduct: {
              productId: product[0].productId,
            },
          },
          token: 'correlationToken',
        })
        .getResponse();
    });
  },
};

// THIS HANDLES THE CONNECTIONS.RESPONSE EVENT AFTER A BUY OCCURS.
const BuyResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Buy';
  },
  handle(handlerInput) {
    console.log('IN BUYRESPONSEHANDLER');

    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const productId = handlerInput.requestEnvelope.request.payload.productId;

    return ms.getInSkillProducts(locale).then(function handlePurchaseResponse(result) {
      const product = result.inSkillProducts.filter(record => record.productId === productId);
      console.log(`PRODUCT = ${JSON.stringify(product)}`);
      if (handlerInput.requestEnvelope.request.status.code === '200') {
        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'ACCEPTED') {
          let categoryFacts = ALL_FACTS;
          if (product[0].referenceName !== 'all_access') categoryFacts = ALL_FACTS.filter(record => record.type === product[0].referenceName.replace('_pack', ''));

          const speakResponse = `You have unlocked the ${product[0].name}.  Here is your ${product[0].referenceName.replace('_pack', '').replace('all_access', '')} fact: ${getRandomFact(categoryFacts)} ${getRandomYesNoQuestion()}`;
          const repromptResponse = getRandomYesNoQuestion();
          return handlerInput.responseBuilder
            .speak(speakResponse)
            .reprompt(repromptResponse)
            .getResponse();
        }
        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'DECLINED') {
          const speakResponse = `Thanks for your interest in the ${product[0].name}.  Would you like another random fact?`;
          const repromptResponse = 'Would you like another random fact?';
          return handlerInput.responseBuilder
            .speak(speakResponse)
            .reprompt(repromptResponse)
            .getResponse();
        }
      }
      // Something failed.
      console.log(`Connections.Response indicated failure. error: ${handlerInput.requestEnvelope.request.status.message}`);

      return handlerInput.responseBuilder
        .speak('you have aready bought this item please try a different one')
        .getResponse();
    });
  },
};

// THIS HANDLES THE CONNECTIONS.RESPONSE EVENT AFTER A CANCEL OCCURS.
const CancelResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Cancel';
  },
  handle(handlerInput) {
    console.log('IN CANCELRESPONSEHANDLER');

    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const productId = handlerInput.requestEnvelope.request.payload.productId;

    return ms.getInSkillProducts(locale).then(function handleCancelResponse(result) {
      const product = result.inSkillProducts.filter(record => record.productId === productId);
      console.log(`PRODUCT = ${JSON.stringify(product)}`);
      if (handlerInput.requestEnvelope.request.status.code === '200') {
        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'ACCEPTED') {
          const speakResponse = `You have successfully cancelled your purchase. ${getRandomYesNoQuestion()}`;
          const repromptResponse = getRandomYesNoQuestion();
          return handlerInput.responseBuilder
            .speak(speakResponse)
            .reprompt(repromptResponse)
            .getResponse();
        }
        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'NOT_ENTITLED') {
          const speakResponse = `You don't currently have a product to cancel. ${getRandomYesNoQuestion()}`;
          const repromptResponse = getRandomYesNoQuestion();
          return handlerInput.responseBuilder
            .speak(speakResponse)
            .reprompt(repromptResponse)
            .getResponse();
        }
      }
      // Something failed.
      console.log(`Connections.Response indicated failure. error: ${handlerInput.requestEnvelope.request.status.message}`);

      return handlerInput.responseBuilder
        .speak('Bye Bye')
        .getResponse();
    });
  },
};

// THIS HANDLES THE CONNECTIONS.RESPONSE EVENT AFTER A BUY OCCURS.
const UpsellResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Upsell';
  },
  handle(handlerInput) {
    console.log('IN UPSELLRESPONSEHANDLER');

    if (handlerInput.requestEnvelope.request.status.code === '200') {
      if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'DECLINED') {
        const speakResponse = `OK.  Here's a random fact: ${getRandomFact(ALL_FACTS)} Would you like another random fact?`;
        const repromptResponse = 'Would you like another random fact?';
        return handlerInput.responseBuilder
          .speak(speakResponse)
          .reprompt(repromptResponse)
          .getResponse();
      }
    }
    // Something failed.
    console.log(`Connections.Response indicated failure. error: ${handlerInput.requestEnvelope.request.status.message}`);

    return handlerInput.responseBuilder
    .speak('Enjoy and Please ask for a fact by saying tell me a thor fact, Please replace thor with your desired fact category.')
    .reprompt(getRandomYesNoQuestion())
    .getResponse();
  },
};





const SessionEndedHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest' ||
      (handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent') ||
      (handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
  },
  handle(handlerInput) {
    console.log('IN SESSIONENDEDHANDLER');
    return handlerInput.responseBuilder
      .speak(getRandomGoodbye())
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${JSON.stringify(error.message)}`);
    console.log(`handlerInput: ${JSON.stringify(handlerInput)}`);
    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please try again.')
      .getResponse();
  },
};

function getResolvedValue(requestEnvelope, slotName) {
  if (requestEnvelope &&
    requestEnvelope.request &&
    requestEnvelope.request.intent &&
    requestEnvelope.request.intent.slots &&
    requestEnvelope.request.intent.slots[slotName] &&
    requestEnvelope.request.intent.slots[slotName].resolutions &&
    requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority &&
    requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0] &&
    requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values &&
    requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0]
      .values[0] &&
    requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0]
      .value &&
    requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0]
      .value.name) {
    return requestEnvelope.request.intent.slots[slotName].resolutions
      .resolutionsPerAuthority[0].values[0].value.name;
  }
  return undefined;
}

function getSpokenValue(requestEnvelope, slotName) {
  if (requestEnvelope &&
    requestEnvelope.request &&
    requestEnvelope.request.intent &&
    requestEnvelope.request.intent.slots &&
    requestEnvelope.request.intent.slots[slotName] &&
    requestEnvelope.request.intent.slots[slotName].value) {
    return requestEnvelope.request.intent.slots[slotName].value;
  }
  return undefined;
}

function isProduct(product) {
  return product &&
    product.length > 0;
}

function isEntitled(product) {
  return isProduct(product) &&
    product[0].entitled === 'ENTITLED';
}

/*
function getProductByProductId(productId) {
  var product_record = res.inSkillProducts.filter(record => record.referenceName == productRef);
}
*/

const RequestLog = {
  process(handlerInput) {
    console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
  },
};

const ResponseLog = {
  process(handlerInput) {
    console.log(`RESPONSE BUILDER = ${JSON.stringify(handlerInput)}`);
  },
};

exports.handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpHandler,
    GetFactHandler,
    YesHandler,
    NoHandler,
    GetCategoryFactHandler,
    BuyResponseHandler,
    CancelResponseHandler,
    UpsellResponseHandler,
    ShoppingHandler,
    ProductDetailHandler,
    BuyHandler,
    CancelSubscriptionHandler,
    SessionEndedHandler,

  )
  .addRequestInterceptors(RequestLog)
  .addResponseInterceptors(ResponseLog)
  .addErrorHandlers(ErrorHandler)
  .lambda();
