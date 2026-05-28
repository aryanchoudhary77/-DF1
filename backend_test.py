#!/usr/bin/env python3
"""
Backend API Testing Script for Agri Dealer Application
Tests: /api/auth/login, /api/auth/verify, /api/dashboard, /api/products
"""

import requests
import json
import sys
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://agri-dealer-hub-1.preview.emergentagent.com/api"

# Test credentials
TEST_MOBILE = "1234567890"
TEST_OTP = "1234"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(test_name: str):
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}Testing: {test_name}{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")

def print_success(message: str):
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message: str):
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_warning(message: str):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")

def print_info(message: str):
    print(f"  {message}")

def test_login() -> Dict[str, Any]:
    """Test POST /api/auth/login"""
    print_test("POST /api/auth/login")
    
    url = f"{BACKEND_URL}/auth/login"
    payload = {"mobile": TEST_MOBILE}
    
    try:
        print_info(f"URL: {url}")
        print_info(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "mobile" in data:
                print_success("Login API working correctly")
                return {"success": True, "data": data}
            else:
                print_error("Response missing required fields (message, mobile)")
                return {"success": False, "error": "Invalid response structure"}
        else:
            print_error(f"Login failed with status {response.status_code}")
            return {"success": False, "error": response.text}
            
    except Exception as e:
        print_error(f"Login request failed: {str(e)}")
        return {"success": False, "error": str(e)}

def test_verify_otp() -> Dict[str, Any]:
    """Test POST /api/auth/verify"""
    print_test("POST /api/auth/verify")
    
    url = f"{BACKEND_URL}/auth/verify"
    payload = {"mobile": TEST_MOBILE, "otp": TEST_OTP}
    
    try:
        print_info(f"URL: {url}")
        print_info(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "dealer" in data:
                print_success("OTP verification successful")
                print_success(f"Access token received: {data['access_token'][:20]}...")
                return {"success": True, "data": data}
            else:
                print_error("Response missing required fields (access_token, dealer)")
                return {"success": False, "error": "Invalid response structure"}
        else:
            print_error(f"OTP verification failed with status {response.status_code}")
            return {"success": False, "error": response.text}
            
    except Exception as e:
        print_error(f"OTP verification request failed: {str(e)}")
        return {"success": False, "error": str(e)}

def test_verify_otp_invalid() -> Dict[str, Any]:
    """Test POST /api/auth/verify with invalid OTP"""
    print_test("POST /api/auth/verify (Invalid OTP)")
    
    url = f"{BACKEND_URL}/auth/verify"
    payload = {"mobile": TEST_MOBILE, "otp": "9999"}
    
    try:
        print_info(f"URL: {url}")
        print_info(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 400:
            print_success("Invalid OTP correctly rejected")
            return {"success": True, "data": response.json()}
        else:
            print_error(f"Expected 400 status code, got {response.status_code}")
            return {"success": False, "error": "Invalid OTP not properly handled"}
            
    except Exception as e:
        print_error(f"Invalid OTP test failed: {str(e)}")
        return {"success": False, "error": str(e)}

def test_dashboard(access_token: str) -> Dict[str, Any]:
    """Test GET /api/dashboard"""
    print_test("GET /api/dashboard")
    
    url = f"{BACKEND_URL}/dashboard"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        print_info(f"URL: {url}")
        print_info(f"Authorization: Bearer {access_token[:20]}...")
        
        response = requests.get(url, headers=headers, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if "dealer" in data and "recent_orders" in data and "schemes" in data:
                print_success("Dashboard API working correctly")
                print_info(f"Dealer: {data['dealer'].get('name', 'N/A')}")
                print_info(f"Recent Orders: {len(data['recent_orders'])} orders")
                print_info(f"Schemes: {len(data['schemes'])} schemes")
                return {"success": True, "data": data}
            else:
                print_error("Response missing required fields (dealer, recent_orders, schemes)")
                return {"success": False, "error": "Invalid response structure"}
        else:
            print_error(f"Dashboard request failed with status {response.status_code}")
            return {"success": False, "error": response.text}
            
    except Exception as e:
        print_error(f"Dashboard request failed: {str(e)}")
        return {"success": False, "error": str(e)}

def test_dashboard_no_auth() -> Dict[str, Any]:
    """Test GET /api/dashboard without authentication"""
    print_test("GET /api/dashboard (No Auth)")
    
    url = f"{BACKEND_URL}/dashboard"
    
    try:
        print_info(f"URL: {url}")
        print_info("No Authorization header")
        
        response = requests.get(url, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 401 or response.status_code == 403:
            print_success("Unauthorized access correctly rejected")
            return {"success": True, "data": response.json()}
        else:
            print_error(f"Expected 401/403 status code, got {response.status_code}")
            return {"success": False, "error": "Authentication not properly enforced"}
            
    except Exception as e:
        print_error(f"No auth test failed: {str(e)}")
        return {"success": False, "error": str(e)}

def test_products() -> Dict[str, Any]:
    """Test GET /api/products"""
    print_test("GET /api/products")
    
    url = f"{BACKEND_URL}/products"
    
    try:
        print_info(f"URL: {url}")
        
        response = requests.get(url, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success(f"Products API working correctly - {len(data)} products found")
                if len(data) > 0:
                    print_info(f"Sample product: {data[0].get('title', 'N/A')}")
                    # Check product structure
                    required_fields = ['id', 'category', 'title', 'description', 'mrp', 'dealer_price']
                    missing_fields = [f for f in required_fields if f not in data[0]]
                    if missing_fields:
                        print_warning(f"Product missing fields: {missing_fields}")
                return {"success": True, "data": data}
            else:
                print_error("Response is not a list")
                return {"success": False, "error": "Invalid response structure"}
        else:
            print_error(f"Products request failed with status {response.status_code}")
            return {"success": False, "error": response.text}
            
    except Exception as e:
        print_error(f"Products request failed: {str(e)}")
        return {"success": False, "error": str(e)}

def test_products_with_category() -> Dict[str, Any]:
    """Test GET /api/products with category filter"""
    print_test("GET /api/products?category=Seeds")
    
    url = f"{BACKEND_URL}/products?category=Seeds"
    
    try:
        print_info(f"URL: {url}")
        
        response = requests.get(url, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success(f"Products category filter working - {len(data)} products found")
                # Verify all products are Seeds category
                if len(data) > 0:
                    non_seeds = [p for p in data if p.get('category') != 'Seeds']
                    if non_seeds:
                        print_error(f"Found {len(non_seeds)} products not in Seeds category")
                        return {"success": False, "error": "Category filter not working"}
                    else:
                        print_success("All products are in Seeds category")
                return {"success": True, "data": data}
            else:
                print_error("Response is not a list")
                return {"success": False, "error": "Invalid response structure"}
        else:
            print_error(f"Products request failed with status {response.status_code}")
            return {"success": False, "error": response.text}
            
    except Exception as e:
        print_error(f"Products category filter test failed: {str(e)}")
        return {"success": False, "error": str(e)}

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}Agri Dealer Application - Backend API Tests{Colors.END}")
    print(f"{Colors.BLUE}Backend URL: {BACKEND_URL}{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    
    results = {
        "total": 0,
        "passed": 0,
        "failed": 0
    }
    
    # Test 1: Login
    results["total"] += 1
    login_result = test_login()
    if login_result["success"]:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 2: Verify OTP (valid)
    results["total"] += 1
    verify_result = test_verify_otp()
    if verify_result["success"]:
        results["passed"] += 1
        access_token = verify_result["data"]["access_token"]
    else:
        results["failed"] += 1
        access_token = None
    
    # Test 3: Verify OTP (invalid)
    results["total"] += 1
    invalid_otp_result = test_verify_otp_invalid()
    if invalid_otp_result["success"]:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 4: Dashboard (with auth)
    if access_token:
        results["total"] += 1
        dashboard_result = test_dashboard(access_token)
        if dashboard_result["success"]:
            results["passed"] += 1
        else:
            results["failed"] += 1
    else:
        print_warning("Skipping dashboard test - no access token")
    
    # Test 5: Dashboard (no auth)
    results["total"] += 1
    no_auth_result = test_dashboard_no_auth()
    if no_auth_result["success"]:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 6: Products (all)
    results["total"] += 1
    products_result = test_products()
    if products_result["success"]:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 7: Products (with category)
    results["total"] += 1
    category_result = test_products_with_category()
    if category_result["success"]:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}Test Summary{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"Total Tests: {results['total']}")
    print(f"{Colors.GREEN}Passed: {results['passed']}{Colors.END}")
    print(f"{Colors.RED}Failed: {results['failed']}{Colors.END}")
    
    if results['failed'] == 0:
        print(f"\n{Colors.GREEN}All tests passed! ✓{Colors.END}\n")
        sys.exit(0)
    else:
        print(f"\n{Colors.RED}Some tests failed! ✗{Colors.END}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
