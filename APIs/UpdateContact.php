<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$ids = inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$propertyType = $inData["propertyType"];
	$zip = inData["zip"];
	$city = inData["city"];
	$state = inData["State"];
	
	

	$conn = new mysqli("localhost", "cop4331c_group9project", "WeLoveCOP4331!", "cop4331c_group9proj");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		
		$sql = "UPDATE RealtorInformation SET 
		FirstName = '$firstName', 
		LastName = '$lastName',
		Email = '$email', 
		Zip = '$zip',
		State = '$state', 
		City = '$city', 
		PhoneNumber = '$phone', 
		propertyType = '$propertyType' 
		WHERE ID = '$ids";
	if ($conn->query($sql) === TRUE) {
  echo "The Contact Information has been updated.";
} 
		else
		{
		    echo "Could not update the contact information.";
		}
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>