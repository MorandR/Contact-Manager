<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$IDs = $inData["userId"];
	$IDss = $inData["contactId"];


	$conn = new mysqli("localhost", "cop4331c_group9project", "WeLoveCOP4331!", "cop4331c_group9proj");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "DELETE FROM RealtorInformation WHERE ID = '" . $IDss . "'" . "AND userID ='" . $IDs . "'";
			if ($conn->query($sql) === TRUE) {
  echo "The Contact has been deleted.";
} 
		else
		{
		    echo "Contact unable to be deleted.";
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
		$retValue = '{"userID":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>