//==创建promise实例，并且在下方进行使用=======================================
//ES6中统一了语法，原生提供了Promise对象
//Promise里面保存着某个未来才会结束的事件。
const promise = new Promise((resolve,reject)=>{
    console.log("promise");
    try {
        // throw new Error("abcdef");
        resolve();
    } catch (error) {
        reject(error);
    }
});
//直接使用promise实例的then方法接收回调
promise.then(function(value){
    console.log("resolve");
},function(error){
    console.log("reject");
    console.log(error);
});
//方法中直接饮用promise对象
function go(){
    return promise;
}
go().then(()=>{
    console.log('执行go方法');
});

//==创建timeout函数，在下方调用=======================================
function timeout(ms){//返回promise实例可以使方法接收回调
    return new Promise((resolve,reject)=>{
        try {
            setTimeout(resolve,ms,'done');
        } catch (error) {
            console.log('timeout出错');
        }
    });
}
timeout(1000).then((value)=>{
    console.log(value);
});
//setTimeout原方法调用
setTimeout((value)=>{
    console.log(value);
},2000,'abc');
//模拟回调方法编写
function testPromise(num1,num2){
    return new Promise((resolve,reject)=>{
        try {
            var result = (num1+num2)*num1;
        } catch (error) {
            reject(error);
        }
        resolve(result);
    });
}
testPromise(5,2).then((value)=>{
    console.log(value);
},(error)=>{
    console.log(error);
});

//==模拟使用promise实现AJAX操作==========================
const getJson = (url)=>{
    const promise = new Promise((resolve,reject)=>{
        const handler = function(){//简写方式会导致拿不到下面的各项数据
            if(this.readyState !== 4){
                return;
            }
            if(this.status === 200){
                resolve(this.response);
            }else{
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open("GET",url);
        client.onreadystatechange = handler;
        client.setRequestHeader("Accept","application/json");
        client.send();
    });
    return promise;
};

getJson('https://jsonplaceholder.typicode.com/todos/1').then((json)=>{
    console.log('Contents:'+json);
},()=>{
    consol.error('出错了',error);
});

//==异步加载图片的例子=============================
function loadImageAsync(url){
    return new Promise(function(resolve,reject){
        const image = new Image();
        image.onload = function(){
            resolve();
        };
        image.onerror =function(){
            reject();
        };
        image.src = url;
    });
}
loadImageAsync('http://e.hiphotos.baidu.com/image/pic/item/b151f8198618367a2e8a46ee23738bd4b31ce586.jpg').then((value)=>{
    console.log(value);
},(error)=>{
    console.log(error);
});

//reject和catch(promise的错误一定会走到reject方法中，如果没写reject才会走到catch中))
go().then(()=>{console.log(value)}).catch(()=>{console.error()});

//在一个promise中将另一个promise作为参数返回=======
const p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>reject(new Error('fail')),2000);
});
const p2 = new Promise((resolve,reject)=>{
    setTimeout(()=>resolve(p1),2000);//此时p2的状态无效，由p1的状态决定p2的状态
});
p2.then(value=>console.log(value)).catch(error=>console.log(error));
//resolve和reject并不会终结Promise参数函数的执行
const finalPromise = new Promise((resolve,reject)=>{
    resolve('resolve');
    return;
    console.log('resolve之后');//此段会在resolve方法之前执行
}).then(r=>{
    console.log(r);
});