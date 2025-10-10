pipeline {
    agent { label 'Docker-node' }

    environment {
        IMAGE_NAME = 'nikitathakre10/todo-app'
        RELEASE_NAME = 'todo-app-release'
        CHART_PATH = 'helm/todo-app'
        NAMESPACE = 'default'
        KUBECONFIG_CREDENTIALS_ID = 'Kubernetes'
    }

    stages {
        stage('Build') {
            steps {
                echo "Using pre-built image: ${IMAGE_NAME}"
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                // Add test commands if needed
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



