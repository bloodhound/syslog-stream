#include <string>
#include <node.h>
#include <syslog.h> // openlog, closelog, syslog, setlogmask

using namespace v8;

char identity[1024];

// First argument is identity string, second is facility integer
static Handle<Value> open(const Arguments& args) {
  args[0]->ToString()->WriteAscii((char*) &identity);
  int facility = args[1]->ToInteger()->Int32Value();

  // Open log has no return value
  openlog(identity, LOG_PID | LOG_NDELAY, facility);

  return True();
}

static Handle<Value> close(const Arguments& args) {
  closelog();

  return Undefined();
}

// First argument is severity level integer, second argument is message string
static Handle<Value> write(const Arguments& args) {
  int severity = args[0]->ToInteger()->Int32Value();
  String::Utf8Value message(args[1]->ToString());

  // Write to syslog
  syslog(severity, "%s", *message);

  return Undefined();
}

// Register node module and create methods
void init(Handle<Object> target) {
  NODE_SET_METHOD(target, "open", open);
  NODE_SET_METHOD(target, "close", close);
  NODE_SET_METHOD(target, "write", write);
}

NODE_MODULE(syslog, init)
