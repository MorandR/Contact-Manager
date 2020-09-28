<?php




	$inData = getRequestInfo();
	
	$ids = $inData["userID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$zip = $inData["zip"];
	$state = $inData["state"];
	$city = $inData["city"];
	$currDate = date("Y-m-d H:i:s");
	$propertyType = $inData["propertyType"];

	$conn = new mysqli("localhost", "cop4331c_group9project", "WeLoveCOP4331!", "cop4331c_group9proj");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	
	    
	    $sql_u = "SELECT * FROM RealtorInformation WHERE Email='$email'";
	    $result = $conn->query($sql_u);
	    if ($result->num_rows > 0)
	    {
	         	returnWithError( "This realtor already exists in this database." );
	    }
	    else {
	    
 $sql = "INSERT INTO RealtorInformation (FirstName,LastName,PhoneNumber,Email, DateCreated, propertyType, userID, Zip, State, City)
    VALUES ('$firstName', '$lastName','$phone','$email', '$currDate', '$propertyType', '$ids', '$zip', '$state', '$city')";
	    if ($conn->query($sql) === TRUE) {
  echo "The realtor has been added to our database.";
} 
else
{
    echo "Could not add contact.";
}
	}

	    $conn->close();
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
