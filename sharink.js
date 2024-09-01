function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//control path = /html/body/div[1]/div[20]/div[1]/div[2]/div[5]/div/div/div[2]
//share path = /html/body/div[3]/div/div[1]/div[2]
//share button = /html/body/div[1]/div[20]/div[1]/div[2]/div[5]/div/div/div[2]/div[2]/span

var code = setTimeout(()=>{
    (() => {

        const shareBut = getElementByXpath('/html/body/div[1]/div[20]/div[1]/div[2]/div[5]/div/div/div[2]/div[2]/span')
        const click = shareBut.onclick;
        shareBut.onclick = () => {
            setTimeout(()=>{
                const yandexControls = getElementByXpath('/html/body/div[3]/div/div[1]/div[2]');
                console.log('controls',yandexControls)

                const el = document.createElement("button");
                el.innerText = 'Универсальное копирование'
                el.classList= ['d-button deco-button d-button_size_S  d-copy__button']
                el.onclick = () => {
                    console.log('title',window.externalAPI.getCurrentTrack().title)
                }
                yandexControls.appendChild(el)
            })
        }


    })()
}, 2000)

document.addEventListener("DOMContentLoaded", code);
