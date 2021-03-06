//Assignamos la clave publica del servidor de mensajes push
const applicationServerPublicKey = 'BO9nv0PGMD_vu1tzUFZ0OMzurn0o378vOYIRmjezBoYhQcb0CFsb_5jZc4bbhLHA1dNBeB-eee0SAKiuYJvBA2g';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }  
  return outputArray;
}
//Comprobamos que el navegador soporta los mensajes push y los ServiceWorker
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
//Añadimos un escuchador al boton para que cuando haga click salte la alerta de permitir las notificaciones
//dentro de la pagina
function initialiseUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);
    
    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}
function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Activado';
    pushButton.disabled = true;
  } else {
    pushButton.textContent = 'Activar';
    pushButton.disabled = false;
  }

  //pushButton.disabled = false;
}
navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initialiseUI();
})
function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed:', subscription);
    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn()
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server
  var prueba = JSON.stringify(subscription);
  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
  document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    //subscriptionDetails.classList.remove('is-invisible');
      

  } else {
     subscriptionDetails.classList.add('is-invisible');
  }
}
function pushdisabled(){
     const subscriptionDetails =
  document.querySelector('.js-subscription-details');
     subscriptionDetails.classList.add('is-invisible');
}
function push(){
  const subscriptionDetails =
  document.querySelector('.js-subscription-details');

  subscriptionDetails.classList.remove('is-invisible');
  alert("ok");
}