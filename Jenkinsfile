pipeline {
    agent { label 'Docker-node' }

    environment {
        IMAGE_NAME = 'nikitathakre10/todo-app'
        RELEASE_NAME = 'todo-app-release'
        CHART_PATH = 'helm/todo-app'
        NAMESPACE = 'default'
        KUBECONFIG_CREDENTIALS_ID = 'Kubernetes'
        SONAR_PROJECT_KEY = 'nikitathakre14_Todo' // Replace with your actual project key
        SONAR_ORGANIZATION = 'nikitathakre14'       // Replace with your actual organization key
    }
    stages {
        stage('Build') {
            steps {
                echo "Using pre-built image: ${IMAGE_NAME}"
            }
        }

        stage('Test & SonarCloud Analysis') {
            environment {
                SONAR_TOKEN = credentials('SONAR')
            }
            steps {
                echo "Running tests and SonarCloud analysis..."
                withSonarQubeEnv('SonarCloud') {
                    sh """
                           mvn clean verify sonar:sonar \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.organization=${SONAR_ORGANIZATION} \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=https://sonarcloud.io \
                          -Dsonar.login=$SONAR_TOKEN
                    """
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                echo "Deploying to Minikube using Helm..."
                withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS_ID}", variable: 'KUBECONFIG')]) {
                    sh """
                        export KUBECONFIG=$KUBECONFIG
                        kubectl config get-contexts
                        kubectl get nodes
                        helm upgrade --install ${RELEASE_NAME} ${CHART_PATH} \
                          --set image.repository=${IMAGE_NAME} \
                          --namespace ${NAMESPACE} \
                          --create-namespace
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Build and deployment succeeded"
        }
        failure {
            echo "Build or deployment failed"
        }
    }
}
