const SHARE_BUTTON_SELECTOR = '.player-controls__track-controls > .d-share-popup.d-share-popup_btn';
const SHARE_ACTIONS_SELECTOR = '.d-share-popup__actions';

console.log('Sharink started...')

if (!window.externalAPI) {
    console.error('Failed to initialize Sharink. Yandex Music API is not accessible')
}

window.externalAPI?.on(externalAPI.EVENT_CONTROLS, initialize);

function getId(name, author, cover){
    (async () => {
        try{
        const rawResponse = await fetch('http://sharink.com:8080/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, author, cover})
        });
        const content = await rawResponse.json();

        console.log(content.id);


            await navigator.clipboard.writeText(`http://sharink.com:8080/get/${content.id}`);
            console.log('Copy success')
        } catch (e) {
            console.log('Copy error',e)
        }
    })();
}

function initialize() {
    setTimeout(() => {
        const shareButton = document.querySelector(SHARE_BUTTON_SELECTOR);

        shareButton.addEventListener('click', () => {
            setTimeout(() => {
                const shareActions = document.querySelector(SHARE_ACTIONS_SELECTOR);

                const lastButton = shareActions.childNodes[shareActions.childNodes.length - 1];

                const newButton = lastButton.cloneNode(true);
                newButton.setAttribute('data-b', Number(lastButton.getAttribute('data-b')) + 1)

                const buttonText = getDeepestChildren(newButton)[0];
                buttonText.innerText = 'Универсальное копирование';

                newButton.addEventListener('click', () => {
                    const currentTrack = window.externalAPI.getCurrentTrack();
                    const artist = currentTrack.artists[0];
                    const coverUrl = currentTrack.cover.replace('%%', '50x50');
                    console.log(coverUrl);

                    //alert(`Title: ${currentTrack.title}.\n\nArtist: ${artist.title}\n\nCover url: ${coverUrl}`)
                    getId(currentTrack.title, artist.title,coverUrl)
                });

                shareActions.appendChild(newButton)
            })
        }, 2000);
    });
}

setTimeout(async ()=>{

    console.log('Done')
}, 2000)