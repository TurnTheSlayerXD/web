const maxPostId = 100

const allPostIds = shuffle(range(1, maxPostId + 1))


window.addEventListener("load", () => {
        sessionStorage.setItem('curPageId', "1")
        const postIds = getPostIdsForPage(sessionStorage.getItem("curPageId"))
        for (const id of postIds) {
            displayEmpty(id).then(() => addEventForCommentButton(id))

            fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(resp => resp.json()).then(replaceLoaderByRealPost)
        }


    }
)

async function addEventForCommentButton(id) {
    const post = document.getElementById(`post_${id}`).getElementsByClassName("forum_post_comment_img")[0]

    post.addEventListener("", (event) => {
        but = event.target
        if (!but.classList.contains("clicked_comment")) {
            but.classList.add("clicked_comment")


            for(const com in )


        } else {
            but.classList.remove("clicked_comment")
            but.replaceChildren()
        }

    })
}


async function replaceLoaderByRealPost(postjson) {
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


async function displayEmpty(postId) {

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
    console.assert(0 < pageId < 101)
    return allPostIds.slice(5 * (pageId - 1) + 1, 5 * (pageId - 1) + 6)
}


async function fetchPostsByIds(postIds) {
}












