<?php

	$conn = new mysqli("localhost", "cop4331c_group9project", "WeLoveCOP4331!", "cop4331c_group9proj");

if (isset($_GET['term'])) {
     
   	$query = "SELECT * FROM RealtorInformation WHERE 
		( FirstName LIKE '%".$_GET['term']."%' OR 
		LastName LIKE '%".$_GET['term']."%' OR 
		Email LIKE '%".$_GET['term']."%' OR 
		propertyType LIKE '%".$_GET['term']."%' OR
		PhoneNumber LIKE '%".$_GET['term']."%' )";


   $result = mysqli_query($conn, $query);
 
    if (mysqli_num_rows($result) > 0) {
     while ($user = mysqli_fetch_array($result)) 
     {
      $res[] = $user['FirstName'];
      $res[] = $user['LastName'];
     }
    } else {
      $res = array();
    }
    //return json res
    echo json_encode($res);
}

?>