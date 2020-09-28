<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	// Parse and store individuals fields from JSON field into variables.
	$userId = $inData["userId"];

	// Establish connection to the database.
$conn = new mysqli("localhost", "cop4331c_group9project", "WeLoveCOP4331!", "cop4331c_group9proj");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT * FROM RealtorInformation WHERE 
		(
		FirstName LIKE '%" . $inData["search"] . "%' OR 
		Email LIKE '%" . $inData["search"] . "%' OR 
		LastName LIKE '%" . $inData["search"] . "%' OR 
		propertyType LIKE '%" . $inData["search"] . "%' OR 
		Zip LIKE '%" . $inData["search"] . "%' OR 
		State LIKE '%" . $inData["search"] . "%' OR 
		City LIKE '%" . $inData["search"] . "%' OR 
		PhoneNumber LIKE '%" . $inData["search"] . "%')";
		


		$result = $conn->query($sql);

		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",\n";
				}

				$searchCount++;

				$date = new DateTime($row["DateContactCreated"] ." UTC");
				$date->setTimezone(new DateTimeZone('America/New_York'));
				$formattedDate = date_format($date, 'm/d/Y');
				
				// Get the search results.
				$searchResults .= '{
				
				"datecontactcreated":"' . $formattedDate . '",
				"FirstName":"' . $row["FirstName"] . '",
				"LastName":"' . $row["LastName"] . '",
				"Email":"' . $row["Email"] . '",
				"PhoneNumber":"' . $row["PhoneNumber"] . '",
				"propertyType":"' . $row["propertyType"] . '",
				"Zip":"' . $row["Zip"] . '",
				"State":"' . $row["State"] . '",
				"UserId":"' . $row["UserID"] . '",
				"City":"' . $row["City"] . '",
				"ID":"'. $row["ID"].'"
				}' ;
				
				// Note for Reference: return all value and we do not have to show them all.
			}

			returnWithInfo( $searchResults );
		}

		else
		{
			$err = "No results found";
			returnWithError($err);
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
		$retValue = '{"id":-1,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>