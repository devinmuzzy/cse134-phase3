import * as DOMPurify from "/node_modules/dompurify/dist/purify.js";

export var storage = [];
var deathRow = null;
var editRow = null;
var htmlListObj = null;
export class Blog{
    constructor(title, date, summary){
        this.title = title;
        this.date = date;
        this.summary = summary;
    }
    asHTML(){
        let s = `<li>
                    <p class="title">Title: ${this.title}</p>
                    <p class="date">Date: ${this.date}</p>
                    <p class="summary">Summary: ${this.summary}</p>
                    <button class="editBtn"><i class="fa fa-home"></i>edit</button>
                    <button class="deleteBtn">delete</button>
                </li>`;
        return s;
    }  
    asEditPrompt(){
        let p = `
        <form method="dialog">
            <div>
                <label for="edit-title">Title</label>
                <input value="${this.title}" type="text" name="title" id="edit-title" required/>
                <label for="edit-date">Date</label>
                <input value="${this.date}" type="date" name="date" id="edit-date" required/>
            </div><div>
                <label for="edit-summary">Summary</label>
                <textarea name="summary" id="edit-summary" required>${this.summary}</textarea>
            </div>
                <button id="editCancelBtn" value="cancel">Cancel</button>
                <button value="save">Save</button>
        </form>
        `
        return p;
    }
    update(title, date, summary){
        this.title = title;
        this.date = date;
        this.summary = summary;
    }
    equals(b){
        // console.log(this.title + ', ' + b.title);
        // console.log(this.title === b.title);
        // console.log(this.date + ', ' + b.date);
        // console.log(this.date == b.date);
        // console.log(this.summary + ', ' + b.summary);
        // console.log(this.summary === b.summary);

        return this.title === b.title && this.date == b.date && this.summary == b.summary;
    } 
}




// stores storage into session
function storageToSession(){
    // turn storage into json object
    let blogs = [];
    for(const i in storage){
        let t = {}
        t['title'] = storage[i].title;
        t['date'] = storage[i].date;
        t['summary'] = storage[i].summary;
        blogs.push(t);
    }
    const blogDict = {"blogs":blogs}
    const blogJSON = JSON.stringify(blogDict);
    console.log(blogJSON);
    localStorage.setItem("blogStorage", blogJSON);
}

function storageFromSession(){
    let stringJSON = localStorage.getItem("blogStorage");
    if(stringJSON == null){
        storage = [];
        return;
    }
    let blogJSON = JSON.parse(stringJSON);
    let newStorage = []
    for(const i in blogJSON['blogs']){
        let title = blogJSON['blogs'][i]['title'];
        let date = blogJSON['blogs'][i]['date'];
        let summary = blogJSON['blogs'][i]['summary'];
        console.log(title +", " + date + ", " + summary)
        newStorage.push(new Blog(title, date, summary))
    }
    storage = newStorage;
}

// prompt the user for info pertaining their new blog
export function addBlogPrompt(){
    let dialogEl = document.getElementById('blogPromptDialog')
    if(dialogEl == null){
        dialogEl = document.createElement('dialog');
        dialogEl.id = 'blogPromptDialog'
        document.body.append(dialogEl);
        dialogEl.addEventListener('close', () => {
            if(dialogEl.returnValue == 'save'){
                let title = document.getElementById('title');
                let date = document.getElementById('date');
                let summary = document.getElementById('summary');
                console.log(title);
                console.log(date);
                console.log(summary);
                createAddBlog(title.value, date.value, summary.value)
            }
            console.log(dialogEl.returnValue);
        })
    }
    let p = `
    <form method="dialog">
        <div>
            <label for="title">Title</label>
            <input type="text" name="title" id="title" required/>
            <label for="date">Date</label>
            <input type="date" name="date" id="date" required/>
        </div><div>
            <label for="summary">Summary</label>
            <textarea name="summary" id="summary" required></textarea>
        </div>
            <button id="addCancelBtn" value="cancel">Cancel</button>
            <button value="save">Save</button>
    </form>
    `
    dialogEl.innerHTML = p;
    document.getElementById('addCancelBtn').addEventListener('click', ()=>{document.getElementById('blogPromptDialog').close(); dialogEl.returnValue = 'NOT SAVE'})
    dialogEl.showModal();
}

// creates then adds blog
function createAddBlog(title, date, summary){
    let b = new Blog(title, date, summary);
    console.log('creating new blog...')
    addBlog(b);
}
// adds blog to storage
export function addBlog(blog){
    storage.push(blog);
    updateUI();
}

// function updateBlog(blog, title, date, summary){
//     let index = storage.findIndex((b) => b.equals(blog));
//     if(index < 0){
//         console.log("ERROR IN UPDATE BLOG")
//         return null;
//     }
//     console.log(storage);
//     console.log(index);
//     console.log(blog);
//     console.log(blog.title);
//     storage[index] = new Blog(title, date, summary);
//     updateUI();
// }

// returns the blog in storage with corrosponding parts
function getBlog(title, date, summary){
    let blog = new Blog(title, date, summary);
    let index = storage.findIndex((b) => b.equals(blog));
    if(index < 0){
        return null;
    }
    return storage[index];
}

// removes blog from storage
export function removeBlog(blog){
    let index = storage.findIndex((b) => b.equals(blog));
    console.log(index)
    if(index < 0){
        return false;
    }
    storage.splice(index, 1);
    updateUI();
    return true;
}

// Returns array of Blog objects in storage as html list 
export function getBlogsHTML(){
    let htmlString = ""
    for(const b in storage){
        console.log(storage[b])
        htmlString = htmlString + storage[b].asHTML();
    }
    return htmlString;
}

// initialization function for all things
export function build(listDomObj){
    htmlListObj = listDomObj
}

export function updateUI(){
    htmlListObj.innerHTML = getBlogsHTML();
    document.querySelectorAll('.deleteBtn').forEach((btn) => btn.addEventListener('click', () => {deleteBlogEvent(btn)}))
    document.querySelectorAll('.editBtn').forEach((btn) => btn.addEventListener('click', () => {editBlogEvent(btn)}))
    storageToSession();
}

function editBlogEvent(editBtn){
    let summary = editBtn.previousElementSibling;
    let date = summary.previousElementSibling;
    let title = date.previousElementSibling;
    // remove prefixes add in object creation
    let summaryContent = summary.textContent.slice(9);
    let dateContent = date.textContent.slice(6);
    let titleContent = title.textContent.slice(7);
    let b = getBlog(titleContent, dateContent, summaryContent);
    console.log("got blog: " + b.title)
    editRow = b;
    editBlogDialog(b);

}

function executeEdit(title, date, summary){
    if(editRow == null){
        console.log('ERROR: execute edit error')
    }
    editRow.title = title;
    editRow.date = date;
    editRow.summary = summary;
    updateUI();
}

// lets a user edit a blog
function editBlogDialog(blog){
    let dialogEl = document.getElementById('editBlogDialog')
    if(dialogEl == null){
        dialogEl = document.createElement('dialog');
        dialogEl.id = 'editBlogDialog'
        document.body.append(dialogEl);
        dialogEl.addEventListener('close', () => {
            if(dialogEl.returnValue === 'save'){
                let title = document.getElementById('edit-title').value;
                let date = document.getElementById('edit-date').value;
                let summary = document.getElementById('edit-summary').value;
                // title =  DOMPurify.sanitize(title);
                // date =  DOMPurify.sanitize(date);
                // summary =  DOMPurify.sanitize(summary);
                console.log('executing edit..' + dialogEl.returnValue) 
                executeEdit(title, date, summary)
            }
            console.log(dialogEl.returnValue)
        });
    }
    let p = blog.asEditPrompt();
    dialogEl.innerHTML = p;
    document.getElementById('editCancelBtn').addEventListener('click', ()=>{document.getElementById('editBlogDialog').close();dialogEl.returnValue = 'NOT SAVE'});
    dialogEl.showModal();
}

// executes blog on deathrow if user confirms
function deleteBlogDialog(){
    let dialogEl = document.getElementById('deleteBlogDialog')
    if(dialogEl == null){
        dialogEl = document.createElement('dialog');
        dialogEl.id = 'deleteBlogDialog'
        document.body.append(dialogEl);
        dialogEl.addEventListener('close', () => {
            if(dialogEl.returnValue == 'true'){
                console.log('deleting...');
                executeBlog();
            }
            console.log(dialogEl.returnValue)
        })
    }
    let p = `
    <form method="dialog">
            <h5>Are you sure you want to delete?</h5>
            <button value="false">cancel</button>
            <button value="true">yes</button>
    </form>
    `
    dialogEl.innerHTML = p;
    dialogEl.showModal();
}

// kill a blog if it is on deathrow
function executeBlog(){
    if(deathRow != null){
        removeBlog(deathRow);
    }
}


function deleteBlogEvent(deleteBtn){
    // traverse DOM to get list values
    let editBtn = deleteBtn.previousElementSibling;
    let summary = editBtn.previousElementSibling;
    let date = summary.previousElementSibling;
    let title = date.previousElementSibling;
    // remove prefixes add in object creation
    let summaryContent = summary.textContent.slice(9);
    let dateContent = date.textContent.slice(6);
    let titleContent = title.textContent.slice(7);
    // summaryContent = DOMPurify.sanitize(summaryContent);
    // dateContent =  DOMPurify.sanitize(dateContent);
    // titleContent = DOMPurify.sanitize(titleContent);
    console.log(`${summaryContent},${dateContent},${titleContent}`)
    deathRow = new Blog(titleContent, dateContent, summaryContent)
    deleteBlogDialog();
}


export function testFillBlogs(){
    storageFromSession();
    // storage = [new Blog('devin', '2022-12-05', 'hey im devin'),
    //         new Blog('mark', '2022-12-05', 'hey im mark'),
    //         new Blog('sammy', '2022-12-05', 'hey im sammy'),
    //         new Blog('reight', '2022-12-05', 'hey im reight')];
    // updateUI();
}
