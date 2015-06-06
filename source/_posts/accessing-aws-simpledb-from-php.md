title: Accessing AWS SimpleDB from PHP
tags:
  - Amazon
  - Amazon.com
  - AWS
  - php
  - SimpleDB
id: 43
categories:
  - Distributed System Design
date: 2009-02-19 19:13:10
---

This week, as I built part of my App Server for Distributed Systems Design, I hit another stumbling block. The library that Amazon provides in PHP for accessing SimpleDB requires PHP 5.2\. I should have known that I need to use the latest version.

Not only did Amazon's library not work for me, but it was huge and complicated. I found another library at: [Google Code](http://code.google.com/p/simpledb-php/), but as fate would have it, that library didn't work either. The code was pretty ugly imho, but at least it was straighforward enough for me to understand how accessing SimpleDB worked, which led me to make my own SimpleDB client.

The script will work with any PHP 5, and doesn't depend on anything that isn't built in by default. I hope it is helpful to someone else. It would be really easy to add the SimpleDB requests I haven't implemented yet.

```php
&lt;?php
/**
 * AWS_SimpleDB_Client v0.1 by Andy VanWagoner, distributed under the ISC licence.
 * Provides simple access to Amazon's SimpleDB from PHP 5.
 *
 * Copyright (c) 2009, Andy VanWagoner
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED &quot;AS IS&quot; AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

class AWS_SimpleDB_Client {

	// AWS SimpleDB API Constants
	private static $service_endpoint	= &quot;sdb.amazonaws.com&quot;;
	private static $api_version			= &quot;2007-11-07&quot;;
	private static $timestamp_format	= &quot;Y-m-d\TH:i:s.\\\\\Z&quot;;
	private static $signature_version	= 1;

	private static $user_agent = &quot;AWS_SimpleDB_Client 0.1 - Andy VanWagoner&quot;;

	/**
	* Constructor
	*
	* @param string $access			// your AWS &quot;Access Key ID&quot;
	* @param string $secret			// your AWS &quot;Seceret Access Key&quot;
	*/
	function AWS_SimpleDB_Client($access, $secret) {
		$this-&gt;access_key = $access;
		$this-&gt;secret_key = $secret;
	}

	/**
	* AWS SimpleDB API - CreateDomain
	* NOTE: This call will take a while (AWS says 10 seconds)
	*
	* @param string $domain			// the domain to create
	*
	* @return array('status'=&gt;array('code'=&gt;, 'message'=&gt;), 'RequestId'=&gt;, 'BoxUsage'=&gt;)
	*/
	function create_domain($domain) {
		$params = array(
			'Action' =&gt; 'CreateDomain',
			'DomainName' =&gt; $domain
		);

		return $this-&gt;post($params);
	}

	/**
	* AWS SimpleDB API - DeleteDomain
	* NOTE: This call will take a while (AWS says 10 seconds)
	*
	* @param string $domain			// the domain to delete
	*
	* @return array('status'=&gt;array('code'=&gt;, 'message'=&gt;), 'RequestId'=&gt;, 'BoxUsage'=&gt;)
	*/
	function delete_domain($domain) {
		$params = array(
			'Action' =&gt; 'DeleteDomain',
			'DomainName' =&gt; $domain
		);

		return $this-&gt;post($params);
	}

	/**
	* AWS SimpleDB API - ListDomains
	*
	* @param string $next = ''		// Optional - Sent as NextToken parameter
	* @param string $max = 100		// Optional - Sent as MaxNumberOfDomains
	*
	* @return array('status'=&gt;array('code'=&gt;, 'message'=&gt;), 'RequestId'=&gt;, 'BoxUsage'=&gt;,
	* 				'DomainName'=&gt;array('...', ...) [, 'NextToken'=&gt;])
	*/
	function list_domains($next = '', $max = 0) {
		$params = array('Action' =&gt; 'ListDomains');

		if ($max &gt; 0 &amp;&amp; $max) return $this-&gt;post($params);
	}

	/**
	* AWS SimpleDB API - PutAttributes
	*
	* @param string $domain			// The domain the item is in
	* @param string $item			// The name of the item
	* @param array  $attributes		// array(array('Name'=&gt;, 'Value'=&gt; [, 'Replace'=&gt;]), ...)
	*
	* @return array('status'=&gt;array('code'=&gt;, 'message'=&gt;), 'RequestId'=&gt;, 'BoxUsage'=&gt;)
	*/
	function put_attributes($domain, $item, $attributes) {
		$params = array(
			'Action' =&gt; 'PutAttributes',
			'DomainName' =&gt; $domain,
			'ItemName' =&gt; $item
		);

		foreach($attributes as $i =&gt; $value) {
			$params[&quot;Attribute.$i.Name&quot;] = $value['Name'];
			$params[&quot;Attribute.$i.Value&quot;] = $value['Value'];
			if (isset($value['Replace']))
				$params[&quot;Attribute.$i.Replace&quot;] = $value['Replace'];
		}

		return $this-&gt;post($params);
	}

	/**
	* AWS SimpleDB API - DeleteAttributes
	*
	* @param string $domain			// The domain the item is in
	* @param string $item			// The name of the item
	* @param array  $attributes		// array(array('Name'=&gt;, 'Value'=&gt;), ...)
	*
	* @return array('status'=&gt;array('code'=&gt;, 'message'=&gt;), 'RequestId'=&gt;, 'BoxUsage'=&gt;)
	*/
	function delete_attributes($domain, $item, $attributes) {
		$params = array(
			'Action' =&gt; 'DeleteAttributes',
			'DomainName' =&gt; $domain,
			'ItemName' =&gt; $item
		);

		foreach($attributes as $i =&gt; $value) {
			$params[&quot;Attribute.$i.Name&quot;] = $value['Name'];
			$params[&quot;Attribute.$i.Value&quot;] = $value['Value'];
		}

		return $this-&gt;post($params);
	}

	/**
	* AWS SimpleDB API - GetAttributes
	*
	* @param string $domain			// the domain name
	* @param string $item			// the item's name
	* @param string $attribute		// Optional - If specified, only this attribute's values are retrieved.
	*
	* @return array('status'=&gt;array('code'=&gt;, 'message'=&gt;), 'RequestId'=&gt;, 'BoxUsage'=&gt;,
	* 				'Attribute'=&gt;array(array('Name'=&gt;,'Value'=&gt;), ...))
	*/
	function get_attributes($domain, $item, $attribute = '') {
		$params = array(
			'Action' =&gt; 'GetAttributes',
			'DomainName' =&gt; $domain,
			'ItemName' =&gt; $item
		);

		if ($attribute)
			$params['AttributeName'] = $attribute;

		return $this-&gt;post($params);
	}

	/**
	* AWS SimpleDB API - Query
	*
	* @param string  $domain		// The domain name
	* @param string  $query			// The query to run on this domain
	* @param string  $next = ''		// OPTIONAL - token supplied on last paged call
	* @param integer $max = 100		// OPTIONAL - max items you want returned 1-250, default = 100
	*
	* @return array('status'=&gt;array('code'=&gt;, 'message'=&gt;), 'RequestId'=&gt;, 'BoxUsage'=&gt;,
	* 				'ItemName'=&gt;array('...', ...))
	*/
	function query($domain, $query, $next = '', $max = 0) {
		$params = array(
			'Action' =&gt; 'Query',
			'DomainName' =&gt; $domain,
			'QueryExpression' =&gt; $query
		);

		if ($max &gt; 250) $max = 250;
		if ($max &gt; 0)
			$params['MaxNumberOfItems'] = $max;
		if ($next)
			$params['NextToken'] = $next;

		return $this-&gt;post($params);
	}

	/**
	 * Sign the parameters, following AWS version 1 signing
	 *
	 * @param array $params			// array of all (except for the signiture) params to be passed to amazon
	 *
	 * @return string				// signature string
	 */
	private function sign($params) {
		uksort($params, 'strnatcasecmp');

		$data = '';
		foreach ($params as $key=&gt;$value) {
			$data .= $key . $value;
		}

		return base64_encode (	pack(&quot;H*&quot;, sha1((str_pad($this-&gt;secret_key, 64, chr(0x00)) ^ (str_repeat(chr(0x5c), 64))) .
								pack(&quot;H*&quot;, sha1((str_pad($this-&gt;secret_key, 64, chr(0x00)) ^ (str_repeat(chr(0x36), 64))) .
								$data)))) );
	}

	/**
	 * POST to AWS SimpleDB and then parse the response.
	 *
	 * @param array $params			// all params to pass on the post
	 *
	 * @return array('status'=&gt;array('code'=&gt;, 'message'=&gt;), 'RequestId'=&gt;, 'BoxUsage'=&gt;, ...)
	 */
	private function post($params) {

		// Add all of the common parameters needed by AWS SimpleDB
		$params['AWSAccessKeyId']	= $this-&gt;access_key;
		$params['Timestamp'] 		= gmdate(self::$timestamp_format, time());
		$params['Version'] 			= self::$api_version;
		$params['SignatureVersion']	= self::$signature_version;
		$params['Signature'] 		= $this-&gt;sign($params);

		// Generate the POST request
		$content = http_build_query($params);

		$post  = 'POST / HTTP/1.0'															. &quot;\r\n&quot;;
		$post .= 'Host: ' 			. self::$service_endpoint 								. &quot;\r\n&quot;;
		$post .= 'Content-Type: ' 	. 'application/x-www-form-urlencoded; charset=utf-8'	. &quot;\r\n&quot;;
		$post .= 'Content-Length: ' . strlen($content)										. &quot;\r\n&quot;;
		$post .= 'User-Agent: ' 	. self::$user_agent 									. &quot;\r\n&quot;;
		$post .= 																			  &quot;\r\n&quot;;
		$post .= $content;

		$socket = @fsockopen(self::$service_endpoint, 80, $errno, $errstr, 10);
  		if ($socket) {
			fwrite($socket, $post);

			$response = stream_get_contents($socket);
			fclose($socket);

			// Parse the response
			return $this-&gt;format_result($response);
		}

		// Return a fail result
		return array('status' =&gt; array('code' =&gt; 404, 'message' =&gt; 'Not Found'),
			'Error' =&gt; array('Code' =&gt; $errno, 'Message' =&gt;
				'Could not connect to ' . $this-&gt;$service_endpoint . &quot; ($errstr)&quot;
			)
		);
	}

	/**
	 * Take the XML document returned by AWS SimpleDB, and transform it into a hash
	 *
	 * @param string $result		// the full http response string from SimpleDB
	 */
	private function format_result($result) {
		list($http_headers, $content) = explode(&quot;\r\n\r\n&quot;, $result, 2);
		$header_lines = explode(&quot;\r\n&quot;, $http_headers);
		list($protocol, $code, $message) = explode(&quot; &quot;, $header_lines[0], 3);

		// record the http status
		$formatted = array('status' =&gt; array('code' =&gt; $code, 'message' =&gt; $message));

		$xml = simplexml_load_string($content);

		// Look for Errors
		if (isset($xml-&gt;Errors)) {
			$formatted['RequestId'] = (string)$xml-&gt;RequestId;
			$formatted['Error'] = array();
			foreach($xml-&gt;Errors-&gt;Error as $error) {
				array_push($formatted['Error'], array(
					'Code' =&gt; (string)$error-&gt;Code,
					'Message' =&gt; (string)$error-&gt;Message
				));
			}
			return $formatted;
		}

		// Get the metadata for this request
		$metadata = $xml-&gt;ResponseMetadata;
		$formatted['RequestId'] = (string)$metadata-&gt;RequestId;
		$formatted['BoxUsage'] = (string)$metadata-&gt;BoxUsage;

		// GetAttributes Response
		if (isset($xml-&gt;GetAttributesResult)) {
			$formatted['Attribute'] = array();
			foreach($xml-&gt;GetAttributesResult-&gt;Attribute as $attribute) {
				array_push($formatted['Attribute'], array(
					'Name' =&gt; (string)$attribute-&gt;Name,
					'Value' =&gt; (string)$attribute-&gt;Value
				));
			}
		}

		// ListDomains Response
		if (isset($xml-&gt;ListDomainsResult)) {
			$formatted['DomainName'] = array();
			foreach($xml-&gt;ListDomainsResult-&gt;DomainName as $domain) {
				array_push($formatted['DomainName'], (string)$domain);
			}
			if (isset($xml-&gt;ListDomainsResult-&gt;NextToken)) {
				$formatted['NextToken'] = (string)$xml-&gt;ListDomainsResult-&gt;NextToken;
			}
		}

		// Query Response
		if (isset($xml-&gt;QueryResult)) {
			$formatted['ItemName'] = array();
			foreach($xml-&gt;QueryResult-&gt;ItemName as $item) {
				array_push($formatted['ItemName'], (string)$item);
			}
			if (isset($xml-&gt;QueryResult-&gt;NextToken)) {
				$formatted['NextToken'] = (string)$xml-&gt;QueryResult-&gt;NextToken;
			}
		}

		return $formatted;
	}
}

?&gt;
```
