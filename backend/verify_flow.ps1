$ErrorActionPreference = "Stop"

Write-Host "1. User Registration"
$registerBody = @{
    name = "Test Farmer"
    email = "farmer2@example.com"
    password = "password123"
    role = "FARMER"
} | ConvertTo-Json
$registerRes = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
Write-Host "Register response: $($registerRes | ConvertTo-Json -Depth 5)"

Write-Host "`n2. User Login"
$loginBody = @{
    email = "farmer2@example.com"
    password = "password123"
} | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.accessToken
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
Write-Host "Login successful. Token acquired."

Write-Host "`n3. Animal Creation"
$animalBody = @{
    animalType = "Cow"
    breed = "Jersey"
    nameOrTag = "Tag123"
    age = 3
    gender = "Female"
    weight = 400.0
    location = "Farm A"
} | ConvertTo-Json
$animalRes = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/animals" -Method Post -Body $animalBody -Headers $headers
$animalId = $animalRes.id
Write-Host "Animal Created with ID: $animalId"

Write-Host "`n3b. Animal Retrieval"
$animalGet = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/animals/$animalId" -Method Get -Headers $headers
Write-Host "Animal Retrieved: $($animalGet.nameOrTag)"

Write-Host "`n4. HealthRecord Creation"
$hrBody = @{
    animalId = $animalId
    temperature = 102.5
    symptoms = "Fever, lethargy"
    behaviour = "Not eating"
    duration = "2 days"
    appetite = "Low"
    waterIntake = "Normal"
    activityLevel = "Low"
    imageUrl = "http://example.com/photo.jpg"
} | ConvertTo-Json
$hrRes = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/health-records" -Method Post -Body $hrBody -Headers $headers
Write-Host "HealthRecord Created with ID: $($hrRes.id)"

Write-Host "`n5. AI Service Call via Spring Boot"
$aiBody = @{
    animalType = $animalGet.animalType
    breed = $animalGet.breed
    age = $animalGet.age
    gender = $animalGet.gender
    symptoms = $hrRes.symptoms
    behaviourChanges = $hrRes.behaviour
    duration = $hrRes.duration
    temperature = $hrRes.temperature
    photoPath = $hrRes.imageUrl
} | ConvertTo-Json
$aiRes = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/ai/predict" -Method Post -Body $aiBody -Headers $headers
Write-Host "AI Response Received:"
Write-Host ($aiRes | ConvertTo-Json -Depth 5)

Write-Host "`nDone."
