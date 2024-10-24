// Jenkins 流水线文件

pipeline {
    agent any

    stages {
        stage('构建') {
            steps {
                withDockerContainer('node') {
                    // some block
                    sh 'ls -la'
                    sh 'npm config set registry https://registry.npmmirror.com'
                    sh 'npm i -g nrm'
                    sh 'nrm test'
                    sh 'nrm use taobao'
                    sh 'npm install'
                    sh 'npm run docs:build'
                    sh 'ls docs/.vitepress'
                }
            }
        }

        stage('制品'){
            steps {
                dir('docs/.vitepress/dist') {
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
                dir('docs/.vitepress/dist') {
                sh 'ls -al'
                writeFile file: 'Dockerfile',
                text: '''FROM nginx:1.26
ADD docs.tar.gz /usr/share/nginx/html/'''
                sh 'cat Dockerfile'
                sh 'docker build -f Dockerfile -t docs-app:latest .'
                sh 'docker rm -f vitepress-site'
                sh 'docker run -d -p 80:80  -p 443:443 --restart=always -v /home/zm/nfs/web-site/vitepress-site/ssl:/usr/share/nginx/ssl -v /home/zm/nfs/web-site/vitepress-site/conf.d:/etc/nginx/conf.d --name vitepress-site docs-app:latest'
                }
            }
        }
    }
}