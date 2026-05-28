#!/usr/bin/env python3
"""
Backend API Testing Script for Agri Dealer Application
Tests: /api/auth/login, /api/auth/verify, /api/dashboard, /api/products, /api/orders, /api/ai/recommend
"""

import requests
import json
import sys
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://agri-dealer-hub-1.preview.emergentagent.com/api"

# Test credentials
TEST_MOBILE = "9979923782"
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

def test_orders(access_token: str) -> Dict[str, Any]:
    """Test GET /api/orders"""
    print_test("GET /api/orders")
    
    url = f"{BACKEND_URL}/orders"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        print_info(f"URL: {url}")
        print_info(f"Authorization: Bearer {access_token[:20]}...")
        
        response = requests.get(url, headers=headers, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success(f"Orders API working correctly - {len(data)} orders found")
                if len(data) > 0:
                    print_info(f"Sample order ID: {data[0].get('id', 'N/A')}")
                    # Check order structure
                    required_fields = ['id', 'dealer_id', 'items', 'total_amount', 'order_status']
                    missing_fields = [f for f in required_fields if f not in data[0]]
                    if missing_fields:
                        print_warning(f"Order missing fields: {missing_fields}")
                return {"success": True, "data": data}
            else:
                print_error("Response is not a list")
                return {"success": False, "error": "Invalid response structure"}
        else:
            print_error(f"Orders request failed with status {response.status_code}")
            return {"success": False, "error": response.text}
            
    except Exception as e:
        print_error(f"Orders request failed: {str(e)}")
        return {"success": False, "error": str(e)}

def test_ai_recommend(access_token: str) -> Dict[str, Any]:
    """Test POST /api/ai/recommend"""
    print_test("POST /api/ai/recommend")
    
    url = f"{BACKEND_URL}/ai/recommend"
    headers = {"Authorization": f"Bearer {access_token}"}
    payload = {
        "crop_type": "Cotton",
        "disease": "Pests",
        "season": "Summer",
        "region": "Maharashtra"
    }
    
    try:
        print_info(f"URL: {url}")
        print_info(f"Authorization: Bearer {access_token[:20]}...")
        print_info(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if "recommendation" in data:
                print_success("AI recommendation API working correctly")
                print_info(f"Recommendation preview: {data['recommendation'][:100]}...")
                return {"success": True, "data": data}
            else:
                print_error("Response missing 'recommendation' field")
                return {"success": False, "error": "Invalid response structure"}
        else:
            print_error(f"AI recommendation request failed with status {response.status_code}")
            return {"success": False, "error": response.text}
            
    except Exception as e:
        print_error(f"AI recommendation request failed: {str(e)}")
        return {"success": False, "error": str(e)}

def test_create_order(access_token: str) -> Dict[str, Any]:
    """Test POST /api/orders"""
    print_test("POST /api/orders")
    
    url = f"{BACKEND_URL}/orders"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        # First get products to create an order
        products_response = requests.get(f"{BACKEND_URL}/products", timeout=10)
        if products_response.status_code != 200 or not products_response.json():
            print_error("Cannot fetch products for order creation")
            return {"success": False, "error": "Products not available"}
        
        products = products_response.json()
        product = products[0]
        
        payload = [
            {
                "product_id": product["id"],
                "title": product["title"],
                "quantity": 2,
                "price": product["dealer_price"]
            }
        ]
        
        print_info(f"URL: {url}")
        print_info(f"Authorization: Bearer {access_token[:20]}...")
        print_info(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['id', 'dealer_id', 'items', 'total_amount', 'order_status']
            if all(field in data for field in required_fields):
                print_success("Create order API working correctly")
                print_info(f"Order ID: {data['id']}")
                print_info(f"Total Amount: ₹{data['total_amount']}")
                print_info(f"Order Status: {data['order_status']}")
                return {"success": True, "data": data}
            else:
                print_error(f"Response missing required fields: {required_fields}")
                return {"success": False, "error": "Invalid response structure"}
        else:
            print_error(f"Create order request failed with status {response.status_code}")
            return {"success": False, "error": response.text}
            
    except Exception as e:
        print_error(f"Create order request failed: {str(e)}")
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
    
    # Test 8: Orders (with auth)
    if access_token:
        results["total"] += 1
        orders_result = test_orders(access_token)
        if orders_result["success"]:
            results["passed"] += 1
        else:
            results["failed"] += 1
    else:
        print_warning("Skipping orders test - no access token")
    
    # Test 9: AI Recommendation (with auth)
    if access_token:
        results["total"] += 1
        ai_result = test_ai_recommend(access_token)
        if ai_result["success"]:
            results["passed"] += 1
        else:
            results["failed"] += 1
    else:
        print_warning("Skipping AI recommendation test - no access token")
    
    # Test 10: Create Order (with auth)
    if access_token:
        results["total"] += 1
        create_order_result = test_create_order(access_token)
        if create_order_result["success"]:
            results["passed"] += 1
        else:
            results["failed"] += 1
    else:
        print_warning("Skipping create order test - no access token")
    
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
