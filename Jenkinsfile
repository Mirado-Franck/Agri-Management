pipeline {
    agent any

    triggers {
        // Jenkins vérifie GitHub chaque minute : si un push est détecté,
        // un build démarre automatiquement (déclencheur CI)
        pollSCM('H/1 * * * *')
    }

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
                bat 'cd frontend && set "CI=false" && npm run build'
            }
        }

        stage('Déploiement') {
            steps {
                echo '=== 5. Déploiement du build vers le dossier servi ==='
                // Copie le build React dans le dossier servi par le serveur web.
                // Les fichiers sont remplacés à chaud : aucun redémarrage nécessaire.
                bat 'xcopy /E /Y /I frontend\\build C:\\agri-deploy'
            }
        }
    }

    post {
        always {
            echo '=== Pipeline terminé ==='
        }
        success {
            echo '=== Succès : build déployé ! ==='
            archiveArtifacts artifacts: 'frontend/build/**', allowEmptyArchive: true
        }
        failure {
            echo '=== Échec : Une étape du pipeline a échoué. ==='
        }
    }
}
