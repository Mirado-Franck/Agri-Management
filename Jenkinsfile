pipeline {
    agent any

    stages {
        stage('Backend - Install & Test') {
            steps {
                echo '=== 1. Installation des dépendances Python ==='
                bat 'pip install -r requirements.txt'

                echo '=== 2. Exécution des tests Backend Django ==='
                bat 'python backend/manage.py test'
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                echo '=== 3. Installation des dépendances React ==='
                bat 'cd frontend && npm install'

                echo '=== 4. Build de production Frontend ==='
                // set "CI=false" évite que les warnings ESLint ne fassent échouer le build.
                // NB: la syntaxe entre guillemets est importante sous Windows :
                // 'set CI=false && ...' inclurait l'espace dans la valeur ("false ")
                // et react-scripts la considérerait toujours comme active.
                bat 'cd frontend && set "CI=false" && npm run build'
            }
        }
    }

    post {
        always {
            echo '=== Pipeline terminé ==='
        }
        success {
            echo '=== Succès : Tous les tests et builds sont validés ! ==='
            // Sauvegarde du dossier de build comme livrable (artefact)
            archiveArtifacts artifacts: 'frontend/build/**', allowEmptyArchive: true
        }
        failure {
            echo '=== Échec : Une étape du pipeline a échoué. ==='
        }
    }
}