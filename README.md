## install typescript
1. instail dependencies
```bash
npm install --save-dev typescript @types/react @types/node
```

2. untuk mendapatkan tsconfig.json, 
```bash 
npm run dev
```
kemudian bisa rename pada jsconfig.json 


## install next-auth
1. jalankan perintah
```bash 
npm install next-auth
```


## install zod validation input
1. jalankan perintah
```bash 
npm install zod
```

## install react-hook-form & @hookform/resolvers
1. jalankan perintah
```bash 
npm install react-hook-form @hookform/resolvers
```

## install react-hot-toast
1. jalankan perintah
```bash 
npm install react-hot-toast
```

## install dependency untuk BE go+gRPC
1. jalankan perintah
```bash 
npm i @protobuf-ts/runtime @protobuf-ts/runtime-rpc @protobuf-ts/grpcweb-transport
```

2. jalankan perintah
```bash 
npm i -D @protobuf-ts/plugin
```

## Generate auth dan base_response dari BE pada folder proto
1  generate protonya lagi yang mengarah ke folder pb
```bash
npx protoc --ts_out ./pb --proto_path ./proto auth/auth.proto
```

2  generate common/base_response
```bash
npx protoc --ts_out ./pb --proto_path ./proto common/base_response.proto
```

## Install Library JWT Decoder
```bash
npm install jwt-decode
```