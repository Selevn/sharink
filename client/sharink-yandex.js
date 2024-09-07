const TRACK_COVER_IMG_SELECTOR = '.player-controls__track-container img';
const TRACK_NAME_SELECTOR = '.player-controls__track-container a.track__title';
const TRACK_AUTHOR_SELECTOR = '.player-controls__track-container .track__artists a';
const CURRENT_TRACK_PLAYER_SELECTOR = '.player-controls__track_shown';

const SHARE_BUTTON_SELECTOR = '.player-controls__track-controls > .d-share-popup.d-share-popup_btn';
const SHARE_ACTIONS_SELECTOR = '.d-share-popup__actions';

console.log('Sharink started...')

checkPlayerReadiness(initialize);

function checkPlayerReadiness(onPlayerReady) {
    const interval = setInterval(() => {
        const currentTrackPlayer = document.querySelector(CURRENT_TRACK_PLAYER_SELECTOR);
        if (!currentTrackPlayer) {
            return;
        }

        clearInterval(interval);
        onPlayerReady?.();
    }, 2000);
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
                    const trackName = document.querySelector(TRACK_NAME_SELECTOR).title;
                    const trackAuthor = document.querySelector(TRACK_AUTHOR_SELECTOR).title;
                    const trackCover = document.querySelector(TRACK_COVER_IMG_SELECTOR).src;

                    getCopyLink(trackName, trackAuthor, trackCover)
                });

                shareActions.appendChild(newButton)
            })
        }, 2000);
    });
}

function getCopyLink(name, author, cover){
    (async () => {
        try {
            chrome.runtime.sendMessage({ action: 'sendRequest', data: { name, author, cover } },
                async (response) => {
                    if (response.error) {
                        console.error('Error:', response.error);

                        return;
                    } 

                    await navigator.clipboard.writeText(`http://sharink.com:8080/get/${response.data.responseObject.id}`);

                    console.log('Copy success')
                }
            );
        } catch (e) {
            console.log('Copy error',e)
        }
    })();
}

// setTimeout(async ()=>{
//     console.log(chrome);

//     chrome.runtime.sendMessage(
//         { action: 'sendRequest', data: { "name": "123", "author":"1234", "cover": "1" } },
//         (response) => {
//             console.log(response);
//             if (response.error) {
//                 console.error('Error:', response.error);
//             } else {
//                 console.log('Response:', response.data);
//             }
//         }
//     );
//     console.log('Done')
// }, 2000)