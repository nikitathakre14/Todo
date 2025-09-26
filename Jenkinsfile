pipeline {
    agent { label 'docker-node' }
    stages {
        stage('Build') {
            steps {
                echo "Building on docker-node"
            }
        }
        stage('Test') {
            steps {
                echo "Running tests..."
            }
        }
    }
    post {
        success {
            echo "Build succeeded"
        }
        failure {
            echo "Build failed"
        }
    }
}
