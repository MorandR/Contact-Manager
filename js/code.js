var urlBase = 'http://dystopiarealty.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var contactId = 0;
var firstName = "";
var lastName = "";
var email = "";
var phone = "";
var login = "";
var password = "";
var propertyType = "";

function displayName()
{
    document.getElementById("searchedName").innerHTML = "Welcome " + firstName + " to DystopiaRealty";
    document.getElementById("searchedPhone").innerHTML = "This dashboard allows you to ADD, SEARCH, UPDATE and";
    document.getElementById("searchedEmail").innerHTML = ".DELETE your Realtor Contact list";
    document.getElementById("searchedPropertyType").innerHTML = "";
    document.getElementById("searchedCity").innerHTML = "";
	document.getElementById("searchedState").innerHTML = "";
	document.getElementById("searchedZip").innerHTML = "";
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	login = document.getElementById("Login").value;
	password = document.getElementById("Password").value;
//	var hash = md5( password );



//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
	    // Sends payload with user info to API
		xhr.send(jsonPayload);
        // Turns info from API into java object.
		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;
        // If user doesn't exist then java object returns undefined.
		if( userId < 1 )
		{
			document.getElementById("userNameError").innerHTML = "UserName/Password does not exist.";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();
		window.location.href = 'http://dystopiarealty.com/dashboard.html';
	}
	catch(err)
	{
		document.getElementById("userNameError").innerHTML = "UserName/Password does not exist.";
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
}

function doLogout() // needs a button on dashboard or not?
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = 'http://dystopiarealty.com/index.html';
}

function addUser() 
{
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	email = document.getElementById("email").value;
	phone = document.getElementById("phone").value;
	login = document.getElementById("login").value;
	password = document.getElementById("password").value;
	
	if (firstName === "")
	{
	    // Doesn't print error messages
	    // Html should print error messages but doesn't anymore.
	    document.getElementById("errorMessage").innerHTML = "First name required!";
	    return;
	}
	if (lastName === "")
	{
	    // Doesn't print error messages
	    // Html should print error messages but doesn't anymore.
	    document.getElementById("errorMessage").innerHTML = "Last name required!";
	    return;
	}
	if (login === "")
	{
	    document.getElementById("errorMessage").innerHTML = "Login required!";
	    return;
	}
	if (password === "")
	{
	    document.getElementById("errorMessage").innerHTML = "Password required!";
	    return;
	}

	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' +lastName + '","email" : "' +email + '", "phone" : "' +phone + '","login" : "' + login + '", "password" : "' + password + '"}';

	var url = urlBase + '/CreateUser.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		var jsonObject2 = JSON.parse( xhr.responseText );
	    document.getElementById("errorMessage").innerHTML = "Error in adding User.";
	   
	}
	catch(err)
	{
		window.location.href = 'http://dystopiarealty.com/index.html';
		document.getElementById("userNameError").innerHTML = "User created!";
	}

}

function addContact()
{
    readCookie();
	var firstName = document.getElementById("addFirstName").value;
	var lastName = document.getElementById("addLastName").value;
	var phone = document.getElementById("addPhoneNumber").value;
	var email = document.getElementById("addEmail").value;
	var propertyType = document.getElementById("addPropertyType").value;
	var city = document.getElementById("addCity").value;
	var state = document.getElementById("addState").value;
	var zip = document.getElementById("addZip").value;


	var jsonPayload = '{ "firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "phone" : "' + phone + '","propertyType" : "' + propertyType + '", "userID" : "' + userId + '", "zip" : "' + zip + '", "state" : "' + state + '", "city" : "' + city + '"}';

	var url = urlBase + '/CreateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		// If jsonObject3 is undefined that means contact doesn't exist in database. 
		var jsonObject3 = JSON.parse( xhr.responseText );
		document.getElementById("displayMessage").innerHTML = "Error in adding contact.";
	}
	catch(err)
	{
	   // document.getElementById("contactName1").innerHTML = firstName + " " + lastName + "&nbsp;&nbsp;";
		document.getElementById("displayMessage").innerHTML = "Contact added";
	}

}

function searchContact() // Need to alert user
{
    readCookie();
	var search = document.getElementById("searchText").value; // ---
	var searchedUserId = 0;
	var searchlastName = "";
	var searchfirstName = "Person Doesn't exist";
	var searchPhone = "";
	var searchEmail = "";
	var searchPropertyType = "";
	var searchCity = "";
	var searchState = "";
	var searchZip = "";

	var jsonPayload = '{"search" : "' + search + '", "userID" : "' + userId + '"}';
	
	var url = urlBase + '/Sandbox.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
			 //   alert("Contact(s) has been retrieved.");
				var jsonObject4 = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject4.results.length; i++ )
				{
				    searchedUserId = jsonObject4.results[i].UserId.toString();
				    if (searchedUserId == userId)
				    {
    				    searchfirstName = jsonObject4.results[i].FirstName.toString();
    				    searchlastName = jsonObject4.results[i].LastName.toString();
    				    searchPhone = jsonObject4.results[i].PhoneNumber.toString();
    				    searchEmail = jsonObject4.results[i].Email.toString();
    				    searchPropertyType = jsonObject4.results[i].propertyType.toString();
    				    searchedCity = jsonObject4.results[i].City.toString();
    				    searchState = jsonObject4.results[i].State.toString();
    				    searchZip = jsonObject4.results[i].Zip.toString();
    				    contactId = jsonObject4.results[i].ID.toString();				        
				    }
				}
				document.getElementById("searchedName").innerHTML = searchfirstName + " " + searchlastName;
				document.getElementById("searchedPhone").innerHTML = searchPhone;
				document.getElementById("searchedEmail").innerHTML = searchEmail;
				document.getElementById("searchedPropertyType").innerHTML = searchPropertyType;
				document.getElementById("searchedCity").innerHTML = searchedCity;
				document.getElementById("searchedState").innerHTML = searchState;
				document.getElementById("searchedZip").innerHTML = searchZip;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
        alert("Failed to search.");
	}

}

function deleteContact() // need to link button and edit
{
    readCookie();
    var jsonPayload = '{"userId" : "' + userId + '", "contactId" : "' + contactId + '"}';
	var url = urlBase + '/DeleteContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		var deleteChoice = confirm("Are you sure you wish to delete currently displayed contact?")

		if (!deleteChoice)
			return;

		xhr.send(jsonPayload);
		alert("Contact Deleted!");
		document.getElementById("searchedName").innerHTML = "Name";
		document.getElementById("searchedPhone").innerHTML = "Phone Number";
		document.getElementById("searchedEmail").innerHTML = "Email";
		document.getElementById("searchedPropertyType").innerHTML = "Property Type";
		document.getElementById("searchedCity").innerHTML = "City";
		document.getElementById("searchedState").innerHTML = "State";
		document.getElementById("searchedZip").innerHTML = "Zip";
	}
	catch(err)
	{
	    alert("Error in deleting contact.");
	}
}

// requires button on dashboard
function updateContact(firstName, lastName, email, phone, currDate,propertyType)
{
    document.getElementById("firstName") = firstName;
    document.getElementById("lastName") = lastName;
    document.getElementById("email") = email;
    document.getElementById("phone") = phone;
    document.getElementById("currDate") = currDate;
    document.getElementById("propertyType") = propertyType;
}

// Do we need to update user?
function updateUser(userId, login, password)
{
    document.getElementById("login") = login;
    document.getElementById("login") = password;
}
