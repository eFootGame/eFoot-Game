// مراجع الواجهات
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

// تبديل بين تسجيل / إنشاء
function showRegister(){
    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");
}

function showLogin(){
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
}

// ==================
// إنشاء حساب
// ==================
function register(){
    const username = document.getElementById("regUsername").value.trim();
    const email    = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if(username === "" || email === "" || password === ""){
        alert("يرجى ملء جميع الحقول");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(res=>{
        const uid = res.user.uid;

        return firebase.database().ref("usersefoot/" + uid).set({
            username: username,
            email: email,
            coins: 200,
            gp: 5000,
            teamPower: 60,
            players: {},
            formation: "4-3-3",
            isAdmin: false
        });
    })
    .then(()=>{
        alert("✅ تم إنشاء الحساب بنجاح، سجل الدخول الآن");
        return firebase.auth().signOut(); // يرجعه لتسجيل الدخول
    })
    .then(()=>{
        showLogin();
    })
    .catch(err=>{
        alert(err.message);
    });
}

// ==================
// تسجيل الدخول + تذكرني
// ==================
function login(){
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const remember = document.getElementById("rememberMe").checked;

    if(email === "" || password === ""){
        alert("أدخل البريد وكلمة السر");
        return;
    }

    const persistence = remember
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;

    firebase.auth().setPersistence(persistence)
    .then(()=>{
        return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .then(()=>{
        window.location = "home.html";
    })
    .catch(err=>{
        alert(err.message);
    });
}

// ==================
// نسيت كلمة السر
// ==================
function forgotPassword(){
    const email = document.getElementById("loginEmail").value.trim();

    if(email === ""){
        alert("أدخل البريد الإلكتروني أولاً");
        return;
    }

    firebase.auth().sendPasswordResetEmail(email)
    .then(()=>{
        alert("📧 تم إرسال رابط إعادة تعيين كلمة السر");
    })
    .catch(err=>{
        alert(err.message);
    });
}
