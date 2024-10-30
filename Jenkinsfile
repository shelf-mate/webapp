@Library("teckdigital") _
def appName = "shelf-mate/webapp"
def localBranchToGitopsValuesPath = [
    'main': 'shelf-mate/deployment.yml',
]

pipeline {
   agent {
    kubernetes {
        inheritFrom "kaniko-template"
    }
  }
    
    stages {
        stage('Build and Tag Image') {
            steps {
                container('kaniko') {
                    script {
                        insertGithubNpmRegistryInfo(secretName: "tpausl-github-token", scope: "shelf-mate")
                        withCredentials([
                            string(credentialsId: "REACT_APP_API_BASE_URL", variable: 'REACT_APP_API_BASE_URL')
                        ]) {
                            buildDockerImage(
                                additionalImageTags: ["latest"], 
                                buildArgs: [
                                    "REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}"
                                ])
                        }
                        buildDockerImage(additionalImageTags: ["latest"])
                        
                    }
                }
            }
        }
        /* stage('Update GitOps') {
            when {
                expression {
                    return localBranchToGitopsValuesPath.containsKey(getLocalBranchName())
                }
            }
            steps {
                script {
                    def valuesPath = localBranchToGitopsValuesPath[getLocalBranchName()]
                    updateGitops(appName: appName, valuesPath: valuesPath, credentialsId: "jozys-github-user", gitOpsRepo: "https://github.com/jozys/gitops.git", fileTypeToChange: "deployment", containerName: "db-delay-frontend")
                    updateGitops(appName: appName, valuesPath: valuesPath, credentialsId: "jozys-github-user", gitOpsRepo: "https://github.com/jozys/gitops.git", fileTypeToChange: "deployment", containerName: "db-delay-backend")
                }
            }
        } */
    }
}