let token = localStorage.getItem('token');

let headers = token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
} : {
    'Content-Type': 'application/json'
};



document.addEventListener("DOMContentLoaded", function() {
    
    let signBtn = document.querySelector(".sign");
    let closeBtn = document.querySelectorAll(".close");
    let changeBox = document.getElementById("signupLink");
    let returnBox = document.getElementById("signinLink");
    let signinForm = document.querySelector(".signin_form");
    let signupForm = document.querySelector(".signup_form");


    signBtn.addEventListener("click", function() {
        signin.style.display = "block";
    });

    changeBox.addEventListener("click", function() {
        signin.style.display = "none";
        signup.style.display = "block";
    });

    returnBox.addEventListener("click", function() {
        signin.style.display = "block";
        signup.style.display = "none";
    });

    closeBtn.forEach(function(btn) {
        btn.addEventListener("click", function() {
            signin.style.display = "none";
            signup.style.display = "none";
            clearFormValues();
        });
    });

    function clearFormValues() {
        if (signinForm) {
            signinForm.reset();
        }
        if (signupForm) {
            signupForm.reset();
        }
        document.querySelector(".message").textContent = "";
        document.querySelector(".message").textContent = "";
    }



});

// 景點
document.addEventListener("DOMContentLoaded", function(){
    // let apiURL = "http://52.37.77.90:8000/api/attractions";
    
    let apiURL = "http://127.0.0.1:8000/api/attractions";
    let container = document.querySelector(".attractionAll");
    let nextPage = 0;
    let loadingData = false;
    let searchInput = document.querySelector(".search_input");
    let searchButton = document.querySelector(".search_button");
    let mrtName = document.querySelector(".mrt_name");
    let scrollLeft = document.querySelector(".scroll_left");
    let scrollRight = document.querySelector(".scroll_right");
    let loading = document.querySelector(".getMore");

    loadAttractions(nextPage);

    function loadAttractions(page, keyword){
        if (loadingData || nextPage === null) {
            return; 
        }loadingData = true;

        let url=apiURL+"?page="+page;
        if (keyword) {
            url=url+"&keyword="+encodeURIComponent(keyword);
        }

        fetch(url,{
            method: "GET",
            headers: headers
        })
            .then(function(response){
                if (!response.ok) {
                    console.log("error");
                }
                return response.json();
            })

            .then(function(travelData){
                let attractions = travelData.data; 
                if (page === 0) {
                    container.innerHTML = "";
                }
               
                attractions.forEach(function(attraction) {
                    let attractionItem = document.createElement("div");
                    attractionItem.className = "attraction_item";
                    attractionItem.innerHTML = `
                        <div class="image-container">
                            <a href="http://127.0.0.1:8000/attraction/${attraction.id}">
                                <img src="${attraction.images.length > 0 ? attraction.images[0] : "default.jpg"}" alt="${attraction.name}">
                            </a>
                            <div class="attraction_title">
                                <div class="attraction_title_font">${attraction.name}</div>   
                            </div>
                        </div>
                        <div class="info">
                            <span>${attraction.mrt}</span>
                            <span>${attraction.category}</span>
                        </div>
                    `;
                    container.appendChild(attractionItem);
                });

                nextPage = travelData.nextPage; 
                loadingData = false;

                if (nextPage === null) {
                    loading.style.display = "none"; 
                }
            })

            .catch(function(error) {
                console.error("Error fetching data:", error);
                loadingData = false;
            });
    };

    function scroll(){
        let rect = loading.getBoundingClientRect();
        let isTop = rect.top <= window.innerHeight;
        let isBottom = rect.bottom >= 0;
        let end = isTop && isBottom;

        if (end && nextPage !== null) {
            loadAttractions(nextPage, searchInput.value);
        }
    };

    window.addEventListener("scroll", scroll);

    function fetchMRT() {
        // fetch("http://52.37.77.90:8000/api/mrts")
        fetch("http://127.0.0.1:8000/api/mrts",{
            method: "GET",
            headers: headers
        })
            .then(function(response) {
                if (!response.ok) {
                    console.log("Error");
                }
                return response.json();
            })
            .then(function(mrtData) {
                let stations = mrtData.data; 
                mrtName.innerHTML = "";
                stations.forEach(function(station) {
                    let button = document.createElement("div");
                    button.className = "station_button";
                    button.textContent = station; 
                    button.addEventListener("click", function() {
                        nextPage = 0;
                        searchInput.value = station; 
                        loadAttractions(nextPage, searchInput.value);
                    });
                    mrtName.appendChild(button);
                });
                mrtName.scrollLeft = 0;
                console.log("finished"); 
            })
            .catch(function(error) {
                console.error("Error fetch", error);
            });
    }
    
    fetchMRT();
   

    scrollLeft.addEventListener("click", function() {
        mrtName.scrollBy({ left: -100});
    });

    scrollRight.addEventListener("click", function() {
        mrtName.scrollBy({ left: 100});
    });

    searchButton.addEventListener("click", function() {
        nextPage = 0; 
        loadAttractions(nextPage, searchInput.value);
    });
});


// 登入
document.addEventListener("DOMContentLoaded", function() {
    let signinForm = document.querySelector(".signin_form");
    signinForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        let email = document.querySelector(".email").value;
        let password = document.querySelector(".password").value;
        
        let signinData={
            "email": email, 
            "password": password
        }
        console.log(signinData)
        

        try {
            let signinResponse = await fetch("http://127.0.0.1:8000/api/user/auth",{
                method: "PUT",
                headers: headers,
                body: JSON.stringify(signinData)
            });

            let signinResult = await signinResponse.json();
            console.log("signinResult",signinResult)
            

            if (signinResponse.ok && signinResult.token) {
                localStorage.setItem("token", signinResult.token);
                console.log(localStorage);
                document.querySelector(".sign").textContent = "登出";
                document.querySelector(".signin").style.display = "none";
                
            } else {
                document.querySelector(".message").textContent = signinResult.message;
            }
        } catch (error) {
            console.error("錯了", error);
        }
    });

    function checkSignin() {
        let token = localStorage.getItem("token");
        if (token) {
            document.querySelector(".sign").textContent = "登出";
        }
    }

    checkSignin();
});


// 註冊
document.addEventListener("DOMContentLoaded", function() {
    let signupForm = document.querySelector(".signup_form");
    if (signupForm) {
        signupForm.addEventListener("submit", async function(event) {
            event.preventDefault(); 

        
            let name = document.querySelector(".signup_name").value;
            let email = document.querySelector(".signup_email").value;
            let password = document.querySelector(".signup_password").value;
            let data = {
                "name": name,
                "email": email,
                "password": password
            };
            
            console.log(data)
           
            let alertWord = await enroll(data);
            document.querySelector(".message").textContent = alertWord.message;
            if(alertWord.message==="註冊成功"){
                document.querySelector(".signup_name").value = "";
                document.querySelector(".signup_email").value = "";
                document.querySelector(".signup_password").value = "";
            }
            
           
        });
    } 
    else {
        console.log("no data");
    }
   
    async function enroll(data) {
        try {
            let response = await fetch("http://127.0.0.1:8000/api/user", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            });

            let checkStatus = await response.json();
           
            // heckStatus 是從後端傳來
            if (checkStatus.error) {
                console.log(checkStatus.error)
                return {message: checkStatus.message};

            } else {
                return {message: "註冊成功"};
            }
        } catch (error) {
            return {
                message: "伺服器內部錯誤"
            };
        }
    }
});



// todo:這是要檢查按下預約行程的。
// async function checkUserInfo() {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         alert('No token found, please log in first.');
//         return;
//     }

//     const response = await fetch('http://127.0.0.1:8000/api/user/auth', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });

//     if (response.ok) {
//         const data = await response.json();
//         document.getElementById('username').innerText = data.data.name;
//         document.getElementById('welcomeMessage').style.display = 'block';
//     } else {
//         alert('Failed to get user info!');
//     }
// }

// document.getElementById('checkUserButton').addEventListener('click', checkUserInfo);