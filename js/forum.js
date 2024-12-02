let allPostIds = []


async function fetchViablePostIds() {

    const res = await fetch("https://jsonplaceholder.typicode.com/posts")

    const arr = [...await res.json()]

    return arr.map(e => e.id)
}


window.addEventListener("load", () => {
        sessionStorage.setItem('curPageId', "1")
        addEventsForPageScrollerButtons()
        fetchViablePostIds().then((res) => {
            allPostIds = shuffle(res)
            mainCycle()
        })
    }
)

function drawCurpageNumber() {
    document.getElementsByClassName('forum_scroller_curpage')[0].innerText = sessionStorage.getItem('curPageId')
}


function replaceScrollerPageId(newPageId) {
    const elem = document.getElementsByClassName('forum_scroller_section')[0]
    elem.getElementsByClassName('forum_scroller_curpage')[0].innerText = newPageId
}

function addEventsForPageScrollerButtons() {
    document.getElementsByClassName('forum_scroller_prevpage')[0].addEventListener('click', (event) => {
        event.preventDefault()
        const curPageId = Number(sessionStorage.getItem('curPageId'))
        if (1 >= curPageId)
            return;
        sessionStorage.setItem('curPageId', curPageId - 1)
        mainCycle()
    })
    document.getElementsByClassName('forum_scroller_nextpage')[0].addEventListener('click', (event) => {
        event.preventDefault()
        const curPageId = Number(sessionStorage.getItem('curPageId'))
        if (curPageId >= 100)
            return;
        sessionStorage.setItem('curPageId', curPageId + 1)
        mainCycle()
    })
}


async function mainCycle() {
    document.getElementsByClassName("forum_posts_section")[0].replaceChildren()
    drawCurpageNumber()
    const curPage = sessionStorage.getItem("curPageId")
    const postIds = getPostIdsForPage(curPage)
    for (const id of postIds) {
        drawLoaderForPost(id).then(() => {
            fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
                .then(resp => resp.json())
                .then(drawLoaderByRealPost).then(_ => addEventForCommentButton(id))
        });
    }
}


function removeCommentLoader(postNode) {
    postNode.removeChild(postNode.getElementsByClassName("loader")[0])
}


async function drawLoaderForComment(commentSection) {
    const loader = document.createElement("div")
    loader.classList.add("loader")
    commentSection.append(loader)
}


async function drawComment(commentjson, commentSection) {

    const html = '<div class="forum_post_comment_header"></div>' +
        '<div class="forum_post_comment_body"></div>'
    const elem = document.createElement("div")
    elem.classList.add("forum_post_comment")

    elem.innerHTML = html

    commentjson.body = commentjson.body.replaceAll("\n", "<br>")

    elem.getElementsByClassName("forum_post_comment_header")[0].innerHTML = "Name: " +
        commentjson.name + "<br>" + "Email: " + commentjson.email

    elem.getElementsByClassName("forum_post_comment_body")[0].innerHTML = commentjson.body

    commentSection.append(elem)
}


async function addEventForCommentButton(id) {

    const post = document.getElementById(`post_${id}`).getElementsByClassName("forum_post_comment_img")[0]

    post.addEventListener("click", (event) => {
        const but = event.target
        const section = but.parentElement.getElementsByClassName("forum_post_comment_section")[0]
        if (!but.classList.contains("clicked_comment")) {
            but.classList.add("clicked_comment");
            drawLoaderForComment(section)
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`)
                .then(resp => resp.json()).then(comms => {
                removeCommentLoader(section)
                for (const com of comms) {
                    drawComment(com, section)
                }
            });

        } else {
            but.classList.remove("clicked_comment")
            section.replaceChildren()
        }

    })
}


async function drawLoaderByRealPost(postjson) {
    const html = '<div class="forum_post_header">\n' +
        '    </div>\n' +
        '    <div class="forum_post_body">\n' +
        '    </div>\n' + '<img class="forum_post_comment_img" src="../imgs/comment.jpg" alt = "Comments">' +
        '    <div class="forum_post_comment_section">\n' +
        '    </div>'

    const post = document.createElement("div")
    post.innerHTML = html

    postjson.title = postjson.title.replaceAll("/n", "<br>")
    postjson.body = postjson.body.replaceAll("/n", "<br>")

    const header = [...post.getElementsByClassName("forum_post_header")][0]
    header.innerHTML = "User: " + postjson.userId + "<br>" + "Title: " + postjson.title
    const body = [...post.getElementsByClassName("forum_post_body")][0]
    body.innerHTML = postjson.body

    document.getElementById(`post_${postjson.id}`).innerHTML = post.innerHTML
}


async function drawLoaderForPost(postId) {

    const body = document.getElementsByClassName("forum_posts_section")[0]
    const post = document.createElement("div")
    post.classList.add("forum_post")
    post.id = `post_${postId}`

    const loader = document.createElement("div")
    loader.classList.add("loader")
    post.append(loader)

    body.append(post)


}


function getPostIdsForPage(pageId) {

    let l = 5 * (pageId - 1) + 1
    l = l > allPostIds.length ? allPostIds.length : l
    let r = 5 * (pageId - 1) + 6
    r = r > allPostIds.length ? allPostIds.length : r
    return allPostIds.slice(l, r)
}

















