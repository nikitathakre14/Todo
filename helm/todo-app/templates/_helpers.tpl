{{- define "todo-app.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{- define "todo-app.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

