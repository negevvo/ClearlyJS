<# : batch portion (begins PowerShell multi-line comment block)
@echo ************************ COMPILE JSX ************************
@echo ****************** FOR CLEARLYJS, WITH BABEL ****************
@echo ************************ VERSION 1.0 ************************
@echo -------------------------------------------------------------
@echo Where are your jsx files located? Answer the questions below
@echo (You can type . for THIS folder, or leave blank for defaults)
@echo -------------------------------------------------------------
@echo off
set /p name=Enter filename or folder name (Default: the whole project): 
set /p folder=Enter output folder name (Default: the "compiled" folder):
If "%name%"=="" (
	@set name="."
)
If "%folder%"=="" (
	@set folder="compiled"
)
If "%folder%"=="" (
	@echo on 
	@echo Compiled files are in the "compiled" folder
	@echo off
)
	@echo on
	@echo -------------------------------------------------------------
	@echo off
	powershell -noexit -noprofile -NoLogo "iex (${%~f0} | out-string)"

: end batch #>

$name=$env:name
$folder=$env:folder

#Check for babel file and create one if it does not exist
$babelFile = '.babelrc'
if (-not(Test-Path -Path $babelFile -PathType Leaf)) {
     try {
         $null = New-Item -ItemType File -Path $babelFile -Force -ErrorAction Stop
         Set-Content $babelFile '{
    "plugins": [
      ["@babel/plugin-transform-react-jsx", { "pragma": "clrly.new" }]
    ],
    "comments": false
}'
     }
     catch {
         throw $_.Exception.Message
     }
}

#Start babel compilation
if($folder -eq ""){
	$folder = "compiled"
}
if($name -eq ""){
	$name = "."
}
npx babel $name --watch --out-dir $folder --out-file-extension .js --ignore "$folder/**/*.js"