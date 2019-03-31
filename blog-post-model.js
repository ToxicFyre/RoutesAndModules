/* jshint esversion: 6 */
const uuidv4 = require('uuid/v4');

let blogDB = [];

for(let i = 0; i < 10; i++)
{
    const post = {id: uuidv4(),
        title: "The Golden Banana",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel mi at turpis scelerisque posuere. In a turpis in lectus maximus hendrerit. Nunc in blandit lorem. Integer felis enim, placerat quis erat eu, congue varius est. Donec dolor sapien, consectetur nec justo et, dignissim interdum augue. Maecenas ultricies est id ante mattis pulvinar sed vel neque. Vestibulum ullamcorper libero id finibus convallis. Mauris porta nisl et neque efficitur, a vestibulum quam cursus. ",
        author: `King Julian the ${i}`,
        publishDate: "24-03-2019"};

    blogDB.push(post);
}

const ListPosts = {
    get : function(){
        return blogDB;
    },
    getAllOf : function(field,value){
        let tempArr = [];
        blogDB.forEach(item => {
            if ( item[field] == value){
                tempArr.push(item);
            }
        });
        return tempArr;
    },
    post : function (item) {
        blogDB.push(item);
        return item;
    },
    exist : function (field,value) {
        for(let i = 0; i < blogDB.length; i++){
            if(blogDB[i][field] === value){
                return true;
            }
        }
        return false;
    },
    delete : function (id) {
        blogDB.forEach(function(item, index, object) {
            if ( item.id == id){

                blogDB.splice(index,1);
                return item;
            }
        });
        return false;
    },
    put : function (id,body) {
        for(let i = 0; i < blogDB.length; i++){
            if(blogDB[i].id === id){

                if('title' in body)
                    blogDB[i].title = body.title;
                if('content' in body)
                    blogDB[i].content = body.content;
                if('author' in body)
                    blogDB[i].author = body.author;
                if('publishDate' in body)
                    blogDB[i].publishDate = body.publishDate;

                return blogDB[i];
            }
        }
    }
};

module.exports = {ListPosts};