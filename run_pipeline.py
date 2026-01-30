import subprocess
import sys
import time
from datetime import datetime

def run_command(command, description):
    print(f"\n{'='*60}")
    print(f"STARTING: {description}")
    print(f"TIME: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}\n")
    
    start_time = time.time()
    
    try:
        # Run command and stream output
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
                
        return_code = process.poll()
        
        end_time = time.time()
        duration = end_time - start_time
        
        if return_code == 0:
            print(f"\n{'='*60}")
            print(f"SUCCESS: {description}")
            print(f"DURATION: {duration:.2f} seconds")
            print(f"{'='*60}\n")
            return True
        else:
            print(f"\n{'='*60}")
            print(f"FAILED: {description}")
            print(f"RETURN CODE: {return_code}")
            print(f"{'='*60}\n")
            return False
            
    except Exception as e:
        print(f"Error running {description}: {e}")
        return False

def main():
    print("Starting SiliconFeed Daily Pipeline...")
    
    # Step 1: Data Collection
    if not run_command("PYTHONPATH=backend/py python3 -u backend/py/Collector.py", "Data Collection"):
        print("Pipeline stopped due to collection failure.")
        sys.exit(1)
        
    # Step 2: AI Summarization
    if not run_command("PYTHONPATH=backend/py python3 -u backend/py/brain/summarizer.py", "AI Summarization"):
        print("Pipeline stopped due to summarization failure.")
        sys.exit(1)
        
    print("\nPipeline completed successfully!")

if __name__ == "__main__":
    main()
