// نظام تسجيل الدخول بالموبايل - تطوير آدم بروجرامر
var kimoVerifier = new firebase.auth.RecaptchaVerifier('kimo-recaptcha', { 'size': 'invisible' });
var kimoResult;

function kimoSendCode() {
    var phone = document.getElementById('kimo-input-phone').value;
    if (!phone.startsWith('+20')) { 
        alert("يا بطل لازم تبدأ بـ +20 (مثال: +2010...)"); 
        return; 
    }
    firebase.auth().signInWithPhoneNumber(phone, kimoVerifier)
        .then(function(result) {
            kimoResult = result;
            document.getElementById('kimo-step-1').style.display = 'none';
            document.getElementById('kimo-step-2').style.display = 'block';
            alert("الكود اتبعت.. افتح الرسائل");
        }).catch(function(error) { 
            alert("خطأ: " + error.message); 
        });
}

function kimoVerifyCode() {
    var code = document.getElementById('kimo-input-code').value;
    kimoResult.confirm(code).then(function(result) {
        alert("أهلاً بك في كيمو أكاديمي!");
        localStorage.setItem('userLoggedIn', 'true');
        window.location.reload(); 
    }).catch(function(error) { 
        alert("الكود غلط، جرب تاني"); 
    });
}
