import subprocess

# Read requirements.txt
with open('requirements.txt', 'r') as f:
    required_packages = set(line.strip() for line in f)

# Get currently installed packages
result = subprocess.run(['pip', 'freeze'], capture_output=True, text=True)
installed_packages = set(line.strip().split('==')[0] for line in result.stdout.splitlines())

# Calculate packages to uninstall
packages_to_remove = installed_packages - required_packages

# Uninstall packages not in requirements.txt
for package in packages_to_remove:
    subprocess.run(['pip', 'uninstall', '-y', package])

print("Uninstallation complete.")
