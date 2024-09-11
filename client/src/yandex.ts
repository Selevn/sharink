import { getDeepestChildren } from './common/helpers';

const TRACK_COVER_IMG_SELECTOR = '.player-controls__track-container img';
const TRACK_NAME_SELECTOR = '.player-controls__track-container a.track__title';
const TRACK_AUTHOR_SELECTOR = '.player-controls__track-container .track__artists a';
const CURRENT_TRACK_PLAYER_SELECTOR = '.player-controls__track_shown';

const SHARE_BUTTON_SELECTOR = '.player-controls__track-controls > .d-share-popup.d-share-popup_btn';
const SHARE_ACTIONS_SELECTOR = '.d-share-popup__actions';

console.log('Sharink started...');

checkPlayerReadiness(initialize);

function checkPlayerReadiness(onPlayerReady?: () => void) {
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
    const shareButton = document.querySelector<HTMLDivElement>(SHARE_BUTTON_SELECTOR)!;

    shareButton.addEventListener('click', () => {
      setTimeout(() => {
        const shareActions = document.querySelector(SHARE_ACTIONS_SELECTOR)!;

        const lastButton = shareActions.childNodes[shareActions.childNodes.length - 1] as HTMLDivElement;

        const newButton = lastButton.cloneNode(true) as HTMLButtonElement;
        newButton.setAttribute('data-b', `${Number(lastButton.getAttribute('data-b')) + 1}`);

        const buttonText = getDeepestChildren(newButton)[0] as HTMLSpanElement;
        buttonText.innerText = 'Универсальное копирование';

        newButton.addEventListener('click', () => {
          const trackName = document.querySelector<HTMLLinkElement>(TRACK_NAME_SELECTOR)!.title;
          const trackAuthor = document.querySelector<HTMLLinkElement>(TRACK_AUTHOR_SELECTOR)!.title;
          const trackCoverRaw = document.querySelector<HTMLImageElement>(TRACK_COVER_IMG_SELECTOR)!.src;

          const trackCoverUrlSegments = trackCoverRaw.split('/');
          trackCoverUrlSegments[trackCoverUrlSegments.length - 1] = '400x400';
          const trackCover = trackCoverUrlSegments.join('/');

          getCopyLink(trackName, trackAuthor, trackCover);
        });

        shareActions.appendChild(newButton);
      });
    });
  });
}

function getCopyLink(name: string, author: string, cover: string) {
  (async () => {
    try {
      chrome.runtime.sendMessage({ action: 'sendRequest', data: { name, author, cover } }, async response => {
        if (response.error) {
          console.error('Error:', response.error);

          return;
        }

        await navigator.clipboard.writeText(`http://sharink.com:8080/track/${response.data.responseObject.id}/page`);

        console.log('Copy success');
      });
    } catch (e) {
      console.log('Copy error', e);
    }
  })();
}
