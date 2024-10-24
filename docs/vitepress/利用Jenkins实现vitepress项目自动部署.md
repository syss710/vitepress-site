---
layout: doc
title: 利用Jenkins实现vitepress项目自动部署
navbar: true
sidebar: true
aside: ture
outline: [2,4]
lastUpdated: true
editLink: false
---

# 利用Jenkins实现vitepress项目自动部署

<Iframe link="//player.bilibili.com/player.html?isOutside=true&aid=1505373496&bvid=BV1pD421g7oH&cid=1567944172&p=1&autoplay=0" />

> 需求：我们利用 VitePress 构建一个个人文档站点，并使用 Docker 和 Jenkins 完成持续部署。
>
> 效果：当我们提交新内容后，自动部署到线上



## 实现步骤

1. 购买服务器：[阿里云](https://www.aliyun.com/daily-act/ecs/activity_selection?userCode=50sid5bu)、[腾讯云](https://curl.qcloud.com/iyFTRSJb)
2. 安装Docker
3. 配置Jenkins
4. 创建VitePress项目
5. 流水线设置
6. Webhook
7. 测试效果



## 创建VitePress项目



## 配置Docker

```shell
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine


sudo yum install -y yum-utils
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable docker --now
```



配置加速

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```



## Jenkins

### 安装Jenkins

```shell
docker run \
-d \
-u root \
--privileged \
-p 8080:8080 \
-p 50000:50000 \
--name jenkins \
--restart=always \
-v jenkins-data:/var/jenkins_home \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /etc/localtime:/etc/localtime:ro \
leifengyang/jenkins:2.455-jdk21
```



### 配置Jenkins

```shell
docker logs jenkins #查看jenkins初始密码
```

1. 修改密码：  Dashboard -> admin -> **Configure**
2. 安装推荐插件
3. 安装 Blueocean 插件： 插件目录搜索“blue ocean” 选择第一个
4. 安装 Docker 插件：插件目录搜索“Docker”选择第一个
5. 安装 Docker Pipeline 插件：选第一个
6. 推荐（选装）：Generic Webhook Trigger



> 参考：
>
> 1. Docker Pipeline 插件文档：https://docs.cloudbees.com/docs/cloudbees-ci/latest/pipelines/docker-workflow
> 2. 配置Docker，填写本机Docker信息。



### 测试Jenkins

1. 新建流水线项目：demo-pipeline；也可以从BlueOcean界面创建

流水线脚本如下：

```groovy
pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
                withDockerContainer('maven') {
                    // some block
                    sh 'mvn -v'
                    sh 'java -version'
                }
            }
        }
    }
}
```

1. 测试运行。自动用docker启动maven环境，并在 maven 内运行命令。



### Jenkins流水线

参考流水线语法

```groovy
pipeline {
    agent any

    stages {
        stage('构建') {
            steps {
                withDockerContainer('node') {
                    // some block
                    sh 'node -v'
                    sh 'npm config set registry https://registry.npmmirror.com'
                    sh 'npm install'
                    sh 'npm run docs:build'
                }
            }
        }

        stage('制品'){
         steps {
             dir('.vitepress/dist') {
                 // some block
                 sh 'ls -al'
                 sh 'tar -zcvf docs.tar.gz *'
                 archiveArtifacts artifacts: 'docs.tar.gz',
                                                allowEmptyArchive: true,
                                                fingerprint: true,
                                                onlyIfSuccessful: true
                 sh 'ls -al'
             }
         }
        }

        stage('部署'){
             steps {
                 dir('.vitepress/dist') {
                                 sh 'ls -al'
                                 writeFile file: 'Dockerfile',
                                           text: '''FROM nginx
ADD docs.tar.gz /usr/share/nginx/html/'''
                                 sh 'cat Dockerfile'
                                 sh 'docker build -f Dockerfile -t docs-app:latest .'
                                 sh 'docker rm -f app'
                                 sh 'docker run -d -p 80:80 --name app docs-app:latest'
                 }
             }
        }
    }
}
```



### tar 命令

```shell
tar -zcvf docs.tar.gz .
```



### 远程构建

#### 配置远程构建

可以访问：http://8.130.71.58:8080/job/demo/build?token=123456&cause=test



#### 配置 API Token

系统管理 ==》 管理用户 ==》选择用户 ==》设置



### shell脚本触发构建

> 编写shell脚本 `xxx.sh`

```shell
#!/bin/bash

# Jenkins服务器的URL
JENKINS_URL="http://your-jenkins-url:8080"

# Jenkins API token（在Jenkins用户配置中生成）
API_TOKEN="your-api-token"

# 要触发的Jenkins job名称
JOB_NAME="your-job-name"

# 触发Jenkins job
curl -X POST "${JENKINS_URL}/job/${JOB_NAME}/build" \
     --user "your-username:${API_TOKEN}"
```



### C++可执行程序触发构建

> 使用curl第三方库，需要库文件

```cpp
#include <iostream>
#include <curl/curl.h>

size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb); 
    return size * nmemb;
}

int main() {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "http://your-jenkins-url:8080/job/your-job-name/build");
        curl_easy_setopt(curl, CURLOPT_USERPWD, "your-username:your-api-token");
        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
        } else {
            std::cout << "Jenkins job triggered successfully!" << std::endl; 
        }

        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();
    return 0;
}
```



### Gitee触发构建

将项目分享到 gitee，配置项目 webhook



### webhook

格式：

```txt
http://admin:1130ec45123a422444d73549c6763f07f3@8.130.71.58:8080/job/demo/build?token=123456
```



测试触发

