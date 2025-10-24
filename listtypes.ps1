$path = Join-Path $env:USERPROFILE '.nuget\packages\microsoft.azure.functions.worker\2.0.0\lib\net9.0\Microsoft.Azure.Functions.Worker.dll'
$dependencyFolders = @(
    (Split-Path $path),
    (Join-Path ${env:ProgramFiles} 'dotnet\packs\NETStandard.Library.Ref\2.1.0\ref\netstandard2.0'),
    (Join-Path ${env:ProgramFiles} 'dotnet\packs\Microsoft.NETCore.App.Ref\9.0.3\ref\net9.0')
)

[System.AppDomain]::CurrentDomain.add_ReflectionOnlyAssemblyResolve({
        param($eventSender, $evtArgs)
        $name = New-Object System.Reflection.AssemblyName($evtArgs.Name)
        foreach ($folder in $dependencyFolders) {
            $candidate = Join-Path $folder ($name.Name + '.dll')
            if (Test-Path $candidate) {
                return [System.Reflection.Assembly]::ReflectionOnlyLoadFrom($candidate)
            }
        }
        return [System.Reflection.Assembly]::ReflectionOnlyLoad($name.FullName)
    })

$asm = [System.Reflection.Assembly]::ReflectionOnlyLoadFrom($path)
$asm.GetExportedTypes() | ForEach-Object { $_.FullName }
