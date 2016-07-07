module.exports = (data) => {
    if(data.request.body.mail === "measca@qq.com") {
        data.body = "";
    } else {
        data.state = 412;
    }
};