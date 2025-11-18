Write-Host "🚀 Creating LUXERA AGENCY project structure..."

# drizzle
New-Item -ItemType Directory -Force -Path "drizzle/meta" | Out-Null
New-Item -ItemType File -Force -Path "drizzle/meta/_journal.json" | Out-Null
New-Item -ItemType File -Force -Path "drizzle/meta/0000_snapshot.json" | Out-Null
New-Item -ItemType File -Force -Path "drizzle/meta/0000_careful_stark_industries.sql" | Out-Null

# public
New-Item -ItemType Directory -Force -Path "public" | Out-Null
"file.svg","globe.svg","next.svg","vercel.svg","window.svg" | ForEach-Object {
  New-Item -ItemType File -Force -Path "public/$_" | Out-Null
}

# src/app/api/contact
New-Item -ItemType Directory -Force -Path "src/app/api/contact" | Out-Null
New-Item -ItemType File -Force -Path "src/app/api/contact/route.ts" | Out-Null

# src/app root files
"favicon.ico","global-error.tsx","globals.css","layout.tsx","page.tsx" | ForEach-Object {
  New-Item -ItemType File -Force -Path "src/app/$_" | Out-Null
}

# components/ui
$uiFiles = @(
"accordion.tsx","alert-dialog.tsx","alert.tsx","aspect-ratio.tsx","avatar.tsx","badge.tsx",
"breadcrumb.tsx","button-group.tsx","button.tsx","calendar.tsx","card.tsx","carousel.tsx",
"chart.tsx","checkbox.tsx","collapsible.tsx","command.tsx","context-menu.tsx","dialog.tsx",
"drawer.tsx","dropdown-menu.tsx","empty.tsx","field.tsx","form.tsx","hover-card.tsx",
"input-group.tsx","input-otp.tsx","input.tsx","item.tsx","kbd.tsx","label.tsx","menubar.tsx",
"navigation-menu.tsx","pagination.tsx","popover.tsx","progress.tsx","radio-group.tsx",
"resizable.tsx","scroll-area.tsx","select.tsx","separator.tsx","sheet.tsx","sidebar.tsx",
"skeleton.tsx","slider.tsx","sonner.tsx","spinner.tsx","switch.tsx","table.tsx","tabs.tsx",
"textarea.tsx","toggle-group.tsx","toggle.tsx","tooltip.tsx"
)
New-Item -ItemType Directory -Force -Path "src/components/ui" | Out-Null
$uiFiles | ForEach-Object { New-Item -ItemType File -Force -Path "src/components/ui/$_" | Out-Null }

# other components
$compFiles = @(
"AboutSection.tsx","CaseStudiesSection.tsx","ContactSection.tsx","ErrorReporter.tsx",
"Footer.tsx","HeroSection.tsx","Navigation.tsx","ParticlesBackground.tsx",
"ServicesSection.tsx","WhatsAppButton.tsx"
)
New-Item -ItemType Directory -Force -Path "src/components" | Out-Null
$compFiles | ForEach-Object { New-Item -ItemType File -Force -Path "src/components/$_" | Out-Null }

# db
New-Item -ItemType Directory -Force -Path "src/db" | Out-Null
"index.ts","schema.ts" | ForEach-Object { New-Item -ItemType File -Force -Path "src/db/$_" | Out-Null }

# hooks
New-Item -ItemType Directory -Force -Path "src/hooks" | Out-Null
New-Item -ItemType File -Force -Path "src/hooks/use-mobile.ts" | Out-Null

# lib/hooks
New-Item -ItemType Directory -Force -Path "src/lib/hooks" | Out-Null
New-Item -ItemType File -Force -Path "src/lib/hooks/use-mobile.tsx" | Out-Null

# lib root
New-Item -ItemType Directory -Force -Path "src/lib" | Out-Null
New-Item -ItemType File -Force -Path "src/lib/utils.ts" | Out-Null

# root files
$rootFiles = @(".env",".gitignore","bun.lock","components.json","drizzle.config.ts","eslint.config.mjs",
"next-env.d.ts","next.config.ts","package-lock.json","package.json","postcss.config.mjs","README.md","tsconfig.json")
$rootFiles | ForEach-Object { New-Item -ItemType File -Force -Path $_ | Out-Null }

Write-Host "✅ All folders and files have been created successfully!"
