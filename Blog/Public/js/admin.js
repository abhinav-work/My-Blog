var value = true;
var count= 0;
var likeIN;
const deleteBlog = (btn) => {
    const blogID = btn.parentNode.querySelector('[name = blogID]').value;
    const csrf = btn.parentNode.querySelector('[name = _csrf]').value;
    const blogElement = btn.closest('.grid')
    console.log("Deleting")
    console.log(blogElement.parentNode)
    fetch('/admin/delete-blog/' + blogID, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data);
            blogElement.parentNode.removeChild(blogElement)
        })
        .catch(err => console.log(err))
}
 const likeFunction = (x, like) => {
                const blogID = x.parentNode.querySelector('[name = blogID]').value;
                const csrf = x.parentNode.querySelector('[name = _csrf]').value;
                var likeChange = parseInt(document.getElementById("likeLabel").innerHTML);
                
                // console.log(blogID)
                // console.log(value)
                // console.log("Count" + count)
                console.log(likeChange)
                if(count > 0)
                {
                    if (likeIN == 1)
                    {
                        console.log("FALSE")
                        likeIN = 0
                    }
                    else{
                        console.log("TRUE")
                        likeIN = 1;
                    }
                }
                else if(count==0)
                {
                        console.log("Count 0")
                        if (like.toString() === 'true')
                        {
                            console.log("TRUE")
                            likeIN = 1 ;
                            console.log(likeIN)
                        }
                        else
                        {
                            console.log("FALSE")
                            likeIn = 0;
                            console.log(likeIN)
                        }
                        document.getElementById("likeID").classList.add('fa-thumbs-up');
                        count++;
                }
                 console.log("Like Change" + likeIN)
                x.classList.toggle("fa-thumbs-down");

                if (likeIN == 1)
                {
                    // console.log("Up like- " + like)
                    document.getElementById("likeLabel").innerHTML = (likeChange-1).toString();
                }
                else
                {
                    //   console.log("Down like- " + like)
                     document.getElementById("likeLabel").innerHTML = (likeChange + 1).toString();
                }
                
                fetch('/admin/like/' + blogID + "?like=" + value, {
                         method: 'POST',
                             headers: {
                                 'csrf-token': csrf
                             }
                })
                    .then(result =>{
                                        
                    })
                    .catch(err => console.log(err))
                    
                value = !value;
              }
            
  