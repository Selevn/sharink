const OPTIONS_BUTTON_SELECTOR = '.middle-controls-buttons ytmusic-menu-renderer ';
const SHARE_BUTTON_SELECTOR = '#top-level-buttons-computed > yt-button-view-model';
const SHARE_ACTIONS_SELECTOR = '#share-targets #contents';

console.log('Sharink started...')

initialize();

function initialize() {
    setTimeout(() => {
        const optionsButton = document.querySelector(OPTIONS_BUTTON_SELECTOR);

        optionsButton.addEventListener('click', () => {
            setTimeout(() => {
                const shareButton = document.querySelector(SHARE_BUTTON_SELECTOR);

                shareButton.addEventListener('click', () => {
                    setTimeout(() => {
                        const shareActions = document.querySelector(SHARE_ACTIONS_SELECTOR);
        
                        const firstShareButton = shareActions.childNodes[0];
        
                        const shareButton = firstShareButton.cloneNode(true);
                        const shareButtonTitle = shareButton.querySelector("#target #title");
        
                        shareButtonTitle.innerText = 'Универсальное копирование';
        
                        shareButton.addEventListener('click', () => {
                            console.log(window.ytplayer.config.arg.title);
                        })
        
                        shareActions.appendChild(shareButton);
                    }, 2000);
                });
            })
        });
    }, 2000);
}
