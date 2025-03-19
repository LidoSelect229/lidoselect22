import { db, doc, getDoc } from "./firebase.js";

async function loadPixel() {
  try {
    const docRef = doc(db, "config", "siteConfig");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const pixelID = docSnap.data().pixelID;
      
      if (pixelID) {
        const fbPixelScript = document.createElement('script');
        fbPixelScript.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
  
          fbq('init', '${pixelID}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(fbPixelScript);
      } else {
        console.error('Pixel ID is missing or invalid in Firestore');
      }
    } else {
      console.error('Site config document not found in Firestore');
    }
  } catch (error) {
    console.error('Error loading Pixel ID:', error);
  }
}

loadPixel();