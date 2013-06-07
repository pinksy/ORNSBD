Option Explicit

Dim connectionString: connectionString = "DRIVER={Microsoft ODBC for Oracle};SERVER=<sid>;User Id=<username>;Password=<password>;"
Dim connection: Set connection = CreateObject("ADODB.Connection")
Dim fruits 
Dim vegetables
Dim iType
Dim iVariety
Dim iSleep
Dim iSales
Dim sSQL

fruits = Array("STRAWBERRY", "BANANA", "MANGO", "WATERMELON", "APPLE", "ORANGE", "PINEAPPLE", "GRAPE", "CHERRY", "KIWI")
vegetables = Array("CARROT", "POTATO", "TOMOATO", "ONION", "BROCCOLI", "MUSHROOM", "LETTUCE", "PEPPER", "PUMPKIN", "COURGETTE")
connection.Open connectionString

Do While True
  Randomize
  iType = Int(2 * Rnd + 1)
  iVariety = Int(10 * Rnd)
  iSales = Int(1001 * Rnd)
  iSleep = Int(601 * Rnd + 200)

  If iType = 1 Then
    sSQL = "UPDATE FRUITS SET SALES = " & iSales & " WHERE FRUIT = '" & fruits(iVariety) & "'"
  Else
    sSQL = "UPDATE VEGETABLES SET SALES = " & iSales & " WHERE VEGETABLE = '" & vegetables(iVariety) & "'"
  End If
  WScript.Echo sSQL
  connection.Execute(sSQL)
  WScript.Sleep iSleep
Loop