var urlBase = 'http://dystopiarealty.com';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("Login").value;
	var password = document.getElementById("Password").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;
        alert("Hello there");
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();

		window.location.href = "register.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "login.html"; // ---
}

function addUser()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var login = document.getElementById("login").value;
	var password = document.getElementById("password").value;

	if (firstName === "")
	{
		document.getElementById("errorMessage").innerHTML = "First name required!";
		return;
	}
	if (lastName === "")
	{
		document.getElementById("errorMessage").innerHTML = "Last name required!";
		return;
	}
	if (login === "")
	{
		document.getElementById("errorMessage").innerHTML = "Login username required!";
		return;
	}
	if (password === "")
	{
		document.getElementById("errorMessage").innerHTML = "Password required!";
		return;
	}
	
// 	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';

	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' +lastName + '", "login" : "' + login + '", "password" : "' + password + '"}';

	var url = urlBase + '/CreateUser.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText);

		document.getElementById("errorMessage").innerHTML = ""; // ---
		document.getElementById("finishMessage").innerHTML = "Added!"; // ---
	}
	catch(err)
	{
		document.getElementById("errorMessage").innerHTML = ""; // ---
	}

}

function addContact()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	var currDate = document.getElementById("currDate").value;
	var propertyType = document.getElementById("propertyType").value;

	if (firstName === "")
	{
		document.getElementById("errorMessage").innerHTML = "First name required!";
		return;
	}
	if (lastName === "")
	{
		document.getElementById("errorMessage").innerHTML = "Last name required!";
		return;
	}

	var jsonPayload = '{ "firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "phone" : "' + phone + '", "currDate" : "' + currDate + '", "propertyType" : "' + propertyType + '"}';
// 	var url = urlBase + '/Login.' + extension;
	var url = urlBase + '/CreateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText);

		document.getElementById("errorMessage").innerHTML = ""; // ---
		document.getElementById("finishMessage").innerHTML = "Added!"; // ---

		searchContact();
	}
	catch(err)
	{
		document.getElementById("errorMessage").innerHTML = ""; // ---
	}

}

function searchContact()
{
	var srch = document.getElementById("searchText").value; // ---
	document.getElementById("colorSearchResult").innerHTML = ""; // ---

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}'; // ---
	var url = urlBase + '/searchContact.' + extension; // ---

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				if (jsonObject.results.length == 1)
					document.getElementById("searchResult").innerHTML = "1 contact found";
				else if (jsonObject.results.length > 1)
					document.getElementById("searchResult").innerHTML = jsonObject.results.length + "Contacts found";
				else
					document.getElementById("searchResult").innerHTML = "No contacts found";

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message; //---
	}

}

// function deleteUser(contactId)
// {
// 	var jsonPayload = '{"userId" : "'+ userId +'"}';
// 	var url = urlBase + '/DeleteUser.' + extension;

// 	var xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, false);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

// 	try
// 	{
// 		var delete = confirm("Are you sure you wish to delete user?");
// 		if (!delete)
// 			return;
// 		xhr.send(jsonPayload);
// 		document.getElementById("errorMessage").innerHTML = "";

// 	}
// 	catch(err)
// 	{
// 		document.getElementById("errorMessage").innerHTML = "";
// 	}
// }
