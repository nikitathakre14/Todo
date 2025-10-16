pipeline {
    agent { label 'Docker-node' }

    environment {
        IMAGE_NAME = 'nikitathakre10/todo-app'
        RELEASE_NAME = 'todo-app-release'
        CHART_PATH = 'helm/todo-app'
        NAMESPACE = 'default'
        KUBECONFIG_CREDENTIALS_ID = 'Kubernetes'
        SONAR_PROJECT_KEY = 'nikitathakre14_Todo'
        SONAR_ORGANIZATION = 'nikitathakre14'
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

        stage('Setup Prometheus & Grafana') {
            steps {
                echo "Setting up Prometheus and Grafana monitoring stack..."
                sh """
                    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
                    helm repo add grafana https://grafana.github.io/helm-charts
                    helm repo update

                    helm upgrade --install prometheus prometheus-community/prometheus \
                      --namespace monitoring --create-namespace

                    helm upgrade --install grafana grafana/grafana \
                      --namespace monitoring --create-namespace \
                      --set adminPassword='admin' \
                      --set service.type=NodePort
                """
            }
        }

        stage('Verify Monitoring Setup') {
            steps {
                echo "Verifying Prometheus and Grafana pods..."
                sh """
                    kubectl get pods -n monitoring
                    kubectl get svc -n monitoring
                """
            }
        }

        stage('New Relic Integration') {
            environment {
                NEW_RELIC_LICENSE_KEY = credentials('NEWRELIC')
            }
            steps {
                echo "Integrating New Relic monitoring..."
                sh """
                    helm upgrade --install newrelic-bundle newrelic/nri-bundle \
                      --namespace monitoring \
                      --set global.licenseKey=$NEW_RELIC_LICENSE_KEY \
                      --set global.cluster=$RELEASE_NAME \
                      --set newrelic-infrastructure.enabled=true \
                      --set newrelic-kube-events.enabled=true \
                      --set newrelic-prometheus-agent.enabled=true \
                      --set newrelic-logging.enabled=true
                """
            }
        }
    }

    post {
        success {
            echo "Build, deployment, and monitoring setup succeeded"
        }
        failure {
            echo "Build, deployment, or monitoring setup failed"
        }
    }
}
