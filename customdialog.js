
export function customAlert(text){
    let dialogEl = document.getElementById('customAlertDialog')
    if(dialogEl == null){
        dialogEl = document.createElement('dialog');
        dialogEl.id = 'customAlertDialog'
        document.body.append(dialogEl);
    }
    dialogEl.innerHTML = `<form method="dialog"><div>
    <h1>${text}</h1>
    <button id="confirmBtn" value="okay">Okay</button>
    </div></form>`;
    dialogEl.showModal();
}

// creates a custom confirm, with text text and sets the returnLocation to true or false
export function customConfirm(text, returnFunc){
    let dialogEl = document.getElementById('customConfirmDialog')
    if(dialogEl == null){
        dialogEl = document.createElement('dialog');
        dialogEl.id = 'customConfirmDialog'
        document.body.append(dialogEl);
        dialogEl.addEventListener('close', () => {
            returnFunc(dialogEl.returnValue);
        });
    }
    dialogEl.innerHTML = `<form method="dialog"><div>
    <h1>${text}</h1>
    <button value="false">Cancel</button><button id="confirmBtn" value="true">Okay</button>
    </div></form>`;
    dialogEl.showModal();
}

// creates a custom confirm, with text text and sets the returnLocation to true or false
export function customPrompt(text, returnFunc){
    let dialogEl = document.getElementById('customPromptDialog')
    if(dialogEl == null){
        dialogEl = document.createElement('dialog');
        dialogEl.id = 'customPromptDialog'
        document.body.append(dialogEl);
        dialogEl.addEventListener('close', () => {
            let returnVal = document.getElementById('promptInputVal').value;
            // if cancel hit, return null
            if(dialogEl.returnValue == 'cancel'){
                returnVal = null;
            }
            returnFunc(returnVal);
        });
    }
    dialogEl.innerHTML = `<form method="dialog"><div>
            <h1>${text}</h1>
            <input id="promptInputVal" type="text"/>
            <button value="cancel">Cancel</button><button id="confirmBtn" value="okay">Okay</button>
            </div></form>`;
    dialogEl.showModal();
}