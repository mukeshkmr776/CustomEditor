#!/bin/bash


# Clean up
rm -rf ../VSCode-Custom-Webapp/dist
rm -rf ../VSCode-Custom-Server/dist
rm -rf target
mkdir -p target/app/
# End


# Compiling Server
echo "Building server..."
cd ../VSCode-Custom-Server
npm i
npm run compile
if [[ $? != 0 ]]; then
    echo;
    echo "ERROR: Server compilation failed.";
    exit 1
fi
cd -
cp -rf ../VSCode-Custom-Server/dist/* target/app/
# End


# Compiling Webapp
echo "Building webapp..."
cd ../VSCode-Custom-Webapp
npm i
npm run build
if [[ $? != 0 ]]; then
    echo;
    echo "ERROR: Webapp compilation failed.";
    exit 1
fi
cd -
mkdir -p target/app/ui/
cp -rf ../VSCode-Custom-Webapp/dist/sample-monaco/* target/app/ui/
# End


# Copying config file
cp -f package.json target/app/
cd target/
tar -cf app.tar app/
gzip app.tar
rm -rf app/
cd ..
pwd
ls -ltr
# End

