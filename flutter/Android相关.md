# Android获取证书指纹
应用市场、高德地图、厂商推送等会用到
`keytool -v -list -keystore /Users/fengxiao/documents/code/flutter_base/android/app/flutter_base.jks`


keytool -v -list -keystore [jks文件路径]

# flutter Android打包
本次所记录的打包流程全部都是在Android Studio上完成的。

## 一、生成签名文件

Android在打包之前需要一个签名文件。

> eclipse的签名文件是以.ketstore为后缀的文件；Android Studio是以.jks为后缀的文件。

这里我们用命令行生成一个.jks的文件。我们使用的是Android Studio自带的debug.keystore密钥库。

```java
// 生成 flutter_base.jks
keytool -genkey -v -keystore ~/flutter_base1.jks -alias flutter_base1 -deststoretype pkcs12 -keyalg RSA -keysize 2048 -validity 10000
-----------------------------生成文件路径-------------别名--
// 查看证书SHA1
2.查看证书信息
keytool -list -v -keystore ~/flutter_base.jks
// 回车.输入刚才的口令密码,即可查看证书的所有信息(例如申请一些三方需要的SHA1).

```

## 二、Android Studio文件配置

### 1、导入sign.jks

在Flutter工程中/android/app/sign.jks，把sign.jks拖进来。

### 2、配置/android/app/build.gradle文件

打包新加的配置如下，可以参照对比：

```
android {
    signingConfigs {
        debug {
            storeFile file("flutter_base.jks")
            storePassword "xcb123123"
            keyAlias "flutter_base"
            keyPassword "xcb123123"
        }

        release {
            storeFile file("flutter_base.jks")
            storePassword "xcb123123"
            keyAlias "flutter_base"
            keyPassword "xcb123123"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            useProguard true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
        debug {
        }
    }
}
```


## 三、Flutter打包apk

从终端进入flutter工程目录，运行以下命令自动生成apk，生成apk路径为：xxx/build/app/outputs/apk/xx.apk

> $ flutter build apk