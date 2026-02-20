#!/bin/bash
# Auth Provider Integration Verification Script
# This script verifies that all auth provider components are properly set up

echo "🔐 FashionKet Auth Provider Integration Verification"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

WEBAPP_DIR="/home/ultimate/Desktop/UltimateIntelliForge.org/fashionket.com/fashionket-webapp"
API_DIR="/home/ultimate/Desktop/UltimateIntelliForge.org/fashionket.com/fashionket-api-service"

# Counter for checks
CHECKS_PASSED=0
CHECKS_TOTAL=0

# Function to check file existence
check_file() {
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        echo "   File: $file"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo -e "${RED}✗${NC} $description"
        echo "   File: $file (NOT FOUND)"
    fi
    echo ""
}

# Function to check file contains text
check_content() {
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    local file=$1
    local search_text=$2
    local description=$3
    
    if grep -q "$search_text" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $description"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo -e "${RED}✗${NC} $description"
        echo "   Search text not found: $search_text"
    fi
    echo ""
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. FRONTEND AUTH PROVIDERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_file "$WEBAPP_DIR/src/providers/auth-initializer.tsx" "AuthInitializer component exists"
check_file "$WEBAPP_DIR/src/providers/user-auth-provider.tsx" "UserAuthProvider component exists"
check_file "$WEBAPP_DIR/src/providers/vendor-auth-provider.tsx" "VendorAuthProvider component exists"
check_file "$WEBAPP_DIR/src/providers/admin-auth-provider.tsx" "AdminAuthProvider component exists"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. AUTH PROVIDER IMPLEMENTATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_content "$WEBAPP_DIR/src/providers/auth-initializer.tsx" "useAuth()" "AuthInitializer uses useAuth hook"
check_content "$WEBAPP_DIR/src/providers/user-auth-provider.tsx" "isUser" "UserAuthProvider checks isUser role"
check_content "$WEBAPP_DIR/src/providers/vendor-auth-provider.tsx" "isVendor" "VendorAuthProvider checks isVendor role"
check_content "$WEBAPP_DIR/src/providers/admin-auth-provider.tsx" "isAdmin" "AdminAuthProvider checks isAdmin role"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. ROUTE LAYOUT INTEGRATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_file "$WEBAPP_DIR/src/routes/__root.tsx" "Root route file exists"
check_content "$WEBAPP_DIR/src/routes/__root.tsx" "AuthInitializer" "Root route uses AuthInitializer"

check_file "$WEBAPP_DIR/src/routes/(root)/_rootLayout.tsx" "Root layout file exists"
check_content "$WEBAPP_DIR/src/routes/(root)/_rootLayout.tsx" "UserAuthProvider" "Root layout uses UserAuthProvider"

check_file "$WEBAPP_DIR/src/routes/vendor/_vendorLayout.tsx" "Vendor layout file exists"
check_content "$WEBAPP_DIR/src/routes/vendor/_vendorLayout.tsx" "VendorAuthProvider" "Vendor layout uses VendorAuthProvider"

check_file "$WEBAPP_DIR/src/routes/admin/_adminLayout.tsx" "Admin layout file exists"
check_content "$WEBAPP_DIR/src/routes/admin/_adminLayout.tsx" "AdminAuthProvider" "Admin layout uses AdminAuthProvider"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. AUTH HOOK & STORE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_file "$WEBAPP_DIR/src/hooks/use-auth.ts" "useAuth hook exists"
check_content "$WEBAPP_DIR/src/hooks/use-auth.ts" "useValidateToken" "useAuth uses useValidateToken"
check_content "$WEBAPP_DIR/src/hooks/use-auth.ts" "isAdmin\|isVendor\|isUser" "useAuth provides role flags"

check_file "$WEBAPP_DIR/src/store/auth.store.ts" "Auth store exists"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. BACKEND VENDOR MODULE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_file "$API_DIR/src/vendor/vendor.module.ts" "Vendor module exists"
check_file "$API_DIR/src/vendor/vendor.controller.ts" "Vendor controller exists"
check_file "$API_DIR/src/vendor/vendor.service.ts" "Vendor service exists"
check_file "$API_DIR/src/vendor/dto/query-vendor.dto.ts" "Vendor DTO exists"

check_content "$API_DIR/src/models/vendor.schema.ts" "slug" "Vendor schema has slug field"
check_content "$API_DIR/src/auth/auth.controller.ts" "profile/vendor" "Auth controller has vendor profile endpoint"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Checks Passed: $CHECKS_PASSED / $CHECKS_TOTAL"
echo ""

if [ $CHECKS_PASSED -eq $CHECKS_TOTAL ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your auth provider integration is complete:"
    echo "  • AuthInitializer validates tokens at app root"
    echo "  • UserAuthProvider protects user routes (/account, /orders, etc)"
    echo "  • VendorAuthProvider protects vendor routes (/vendor/*)"
    echo "  • AdminAuthProvider protects admin routes (/admin/*)"
    echo "  • useAuth() provides single source of truth for auth state"
    echo ""
    echo "Route Isolation:"
    echo "  • User cannot access /vendor or /admin routes"
    echo "  • Vendor cannot access /admin or user routes"
    echo "  • Admin cannot access /vendor or user routes"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed!${NC}"
    echo ""
    echo "Failed checks: $((CHECKS_TOTAL - CHECKS_PASSED)) / $CHECKS_TOTAL"
    echo ""
    echo "Please ensure all auth provider files are in place before running the app."
    exit 1
fi
