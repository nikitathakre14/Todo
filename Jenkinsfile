pipeline {
    agent { label 'Docker-node' }

    environment {
        IMAGE_NAME = 'nikitathakre10/todo-app'
        RELEASE_NAME = 'todo-app-release'
        CHART_PATH = 'helm/todo-app'
        NAMESPACE = 'default'
        KUBECONFIG_CREDENTIALS_ID = 'Kubernetes'
        SONAR_PROJECT_KEY = 'todo-2.0'
        SONARQUBE_TOKEN = credentials('SonarQubeServer') 
        SONAR_HOST_URL = 'http://localhost:9000'

    }

    stages {
        stage('Build') {
            steps {
                echo "Using pre-built image: ${IMAGE_NAME}"
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube-Server') {
                        sh '''
                            sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.sources=. \
                                -Dsonar.projectVersion=${DOCKER_TAG} \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=${SONARQUBE_TOKEN}
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to Minikube') {
            steps {
                echo "Deploying to Minikube using Helm..."
                withCredentials([file(credentialsId: "${KUBECONFIG_CREDENTIALS_ID}", variable: 'KUBECONFIG')]) {
                    sh '''
                        export KUBECONFIG=$KUBECONFIG
                        kubectl config get-contexts
                        kubectl get nodes
                        helm upgrade --install ${RELEASE_NAME} ${CHART_PATH}                           --set image.repository=${IMAGE_NAME}                           --namespace ${NAMESPACE}                           --create-namespace
                    '''
                }
            }
        }

        stage('Setup Prometheus & Grafana') {
            steps {
                echo "Setting up Prometheus and Grafana monitoring stack..."
                sh '''
                    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
                    helm repo add grafana https://grafana.github.io/helm-charts
                    helm repo update

                    helm upgrade --install prometheus prometheus-community/prometheus                       --namespace monitoring --create-namespace

                    helm upgrade --install grafana grafana/grafana                       --namespace monitoring --create-namespace                       --set adminPassword='admin'                       --set service.type=NodePort
                '''
            }
        }

        stage('Verify Monitoring Setup') {
            steps {
                echo "Verifying Prometheus and Grafana pods..."
                sh '''
                    kubectl get pods -n monitoring
                    kubectl get svc -n monitoring
                '''
            }
        }

    
    }

    post {
        success {
            echo "Build, deployment, monitoring setup, and SonarQube integration succeeded"
        }
        failure {
            echo "Pipeline failed during one of the stages"
        }
    }
}
